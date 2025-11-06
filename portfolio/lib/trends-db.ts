import { ObjectId } from 'mongodb';
import { getDatabase, COLLECTIONS } from './mongodb';
import type { TrendSummary, TrendCategory, TrendStatus } from '@/types/trend';

// Track if indexes have been created
let indexesCreated = false;

// Create indexes (run once during setup)
export async function createTrendsIndexes() {
  if (indexesCreated) return; // Skip if already created

  try {
    const db = await getDatabase();
    const trendsCollection = db.collection(COLLECTIONS.TRENDS);
    const archiveCollection = db.collection(COLLECTIONS.TRENDS_ARCHIVE);

    // Index for efficient date-based queries
    await trendsCollection.createIndex({ date: -1 });
    await archiveCollection.createIndex({ date: -1 });

    // Index for filtering by category and status
    await trendsCollection.createIndex({ category: 1, status: 1 });
    await trendsCollection.createIndex({ status: 1, date: -1 });

    // Compound index for deduplication (category + date)
    await trendsCollection.createIndex(
      { category: 1, date: 1 },
      { unique: false } // Not unique since we can have multiple summaries per day
    );

    // Index for text search
    await trendsCollection.createIndex({ title: 'text', summary: 'text' });

    indexesCreated = true;
    console.log('✓ MongoDB indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
    // Don't throw - indexes will be created on next attempt
  }
}

// Auto-initialize indexes on first use
async function ensureIndexes() {
  if (!indexesCreated) {
    await createTrendsIndexes();
  }
}

// Create a new trend summary
export async function createTrend(trend: Omit<TrendSummary, '_id'>): Promise<TrendSummary> {
  await ensureIndexes(); // Auto-create indexes on first use

  const db = await getDatabase();
  const collection = db.collection(COLLECTIONS.TRENDS);

  const result = await collection.insertOne({
    ...trend,
    metadata: {
      ...trend.metadata,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return {
    ...trend,
    _id: result.insertedId.toString(),
  };
}

// Get trends with pagination and filtering
export async function getTrends(options: {
  page?: number;
  limit?: number;
  category?: TrendCategory;
  status?: TrendStatus;
  startDate?: Date;
  endDate?: Date;
  includeArchived?: boolean;
}): Promise<{ trends: TrendSummary[]; total: number }> {
  await ensureIndexes(); // Auto-create indexes on first use

  const {
    page = 1,
    limit = 20,
    category,
    status,
    startDate,
    endDate,
    includeArchived = false,
  } = options;

  const db = await getDatabase();
  const collectionName = includeArchived ? COLLECTIONS.TRENDS_ARCHIVE : COLLECTIONS.TRENDS;
  const collection = db.collection(collectionName);

  // Build query
  const query: any = {};

  if (category) query.category = category;
  if (status) query.status = status;

  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = startDate;
    if (endDate) query.date.$lte = endDate;
  }

  // Get total count
  const total = await collection.countDocuments(query);

  // Get paginated results
  const trends = await collection
    .find(query)
    .sort({ date: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  return {
    trends: trends.map((doc) => ({
      ...doc,
      _id: doc._id.toString(),
      date: new Date(doc.date),
      sources: doc.sources.map((s: any) => ({
        ...s,
        publishedAt: new Date(s.publishedAt),
      })),
      metadata: {
        ...doc.metadata,
        createdAt: new Date(doc.metadata.createdAt),
        updatedAt: new Date(doc.metadata.updatedAt),
        publishedAt: doc.metadata.publishedAt ? new Date(doc.metadata.publishedAt) : undefined,
        archivedAt: doc.metadata.archivedAt ? new Date(doc.metadata.archivedAt) : undefined,
      },
    })) as TrendSummary[],
    total,
  };
}

// Get a single trend by ID
export async function getTrendById(id: string, includeArchived = false): Promise<TrendSummary | null> {
  const db = await getDatabase();

  // Try active collection first
  let collection = db.collection(COLLECTIONS.TRENDS);
  let doc = await collection.findOne({ _id: new ObjectId(id) });

  // If not found and includeArchived is true, try archive
  if (!doc && includeArchived) {
    collection = db.collection(COLLECTIONS.TRENDS_ARCHIVE);
    doc = await collection.findOne({ _id: new ObjectId(id) });
  }

  if (!doc) return null;

  return {
    ...doc,
    _id: doc._id.toString(),
    date: new Date(doc.date),
    sources: doc.sources.map((s: any) => ({
      ...s,
      publishedAt: new Date(s.publishedAt),
    })),
    metadata: {
      ...doc.metadata,
      createdAt: new Date(doc.metadata.createdAt),
      updatedAt: new Date(doc.metadata.updatedAt),
      publishedAt: doc.metadata.publishedAt ? new Date(doc.metadata.publishedAt) : undefined,
      archivedAt: doc.metadata.archivedAt ? new Date(doc.metadata.archivedAt) : undefined,
    },
  } as TrendSummary;
}

// Update a trend
export async function updateTrend(
  id: string,
  updates: Partial<TrendSummary>
): Promise<TrendSummary | null> {
  const db = await getDatabase();
  const collection = db.collection(COLLECTIONS.TRENDS);

  // Remove _id from updates to prevent MongoDB immutable field error
  const { _id, ...safeUpdates } = updates as any;

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...safeUpdates,
        'metadata.updatedAt': new Date(),
      },
    },
    { returnDocument: 'after' }
  );

  // findOneAndUpdate returns the modified document directly
  if (!result) return null;

  const doc = result; // Result IS the document, not wrapped in .value

  return {
    ...doc,
    _id: doc._id.toString(),
    date: new Date(doc.date),
    sources: doc.sources.map((s: any) => ({
      ...s,
      publishedAt: new Date(s.publishedAt),
    })),
    metadata: {
      ...doc.metadata,
      createdAt: new Date(doc.metadata.createdAt),
      updatedAt: new Date(doc.metadata.updatedAt),
      publishedAt: doc.metadata.publishedAt ? new Date(doc.metadata.publishedAt) : undefined,
      archivedAt: doc.metadata.archivedAt ? new Date(doc.metadata.archivedAt) : undefined,
    },
  } as TrendSummary;
}

// Delete a trend
export async function deleteTrend(id: string): Promise<boolean> {
  const db = await getDatabase();
  const collection = db.collection(COLLECTIONS.TRENDS);

  const result = await collection.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

// Archive trends older than the specified number of days
export async function archiveOldTrends(daysOld = 90): Promise<number> {
  const db = await getDatabase();
  const trendsCollection = db.collection(COLLECTIONS.TRENDS);
  const archiveCollection = db.collection(COLLECTIONS.TRENDS_ARCHIVE);

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  // Find trends to archive
  const trendsToArchive = await trendsCollection
    .find({
      date: { $lt: cutoffDate },
      status: 'published',
    })
    .toArray();

  if (trendsToArchive.length === 0) return 0;

  // Add archivedAt timestamp
  const archivedTrends = trendsToArchive.map((trend) => ({
    ...trend,
    status: 'archived',
    metadata: {
      ...trend.metadata,
      archivedAt: new Date(),
    },
  }));

  // Insert into archive
  await archiveCollection.insertMany(archivedTrends);

  // Delete from active collection
  const result = await trendsCollection.deleteMany({
    _id: { $in: trendsToArchive.map((t) => t._id) },
  });

  return result.deletedCount || 0;
}

// Get statistics
export async function getTrendsStats() {
  const db = await getDatabase();
  const trendsCollection = db.collection(COLLECTIONS.TRENDS);
  const archiveCollection = db.collection(COLLECTIONS.TRENDS_ARCHIVE);

  const [activeCount, archivedCount, byCategory, byStatus] = await Promise.all([
    trendsCollection.countDocuments(),
    archiveCollection.countDocuments(),
    trendsCollection
      .aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
      ])
      .toArray(),
    trendsCollection
      .aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ])
      .toArray(),
  ]);

  return {
    activeCount,
    archivedCount,
    totalCount: activeCount + archivedCount,
    byCategory: Object.fromEntries(byCategory.map((c) => [c._id, c.count])),
    byStatus: Object.fromEntries(byStatus.map((s) => [s._id, s.count])),
  };
}
