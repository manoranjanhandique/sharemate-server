# Mongoose's pre 
    Mongoose's pre middleware allows you to execute custom logic before specific Mongoose methods or lifecycle events (like save, remove, update, etc.) are executed. 
# Key Points About pre Middleware
    ~Runs Before the Specified Operation: Executes before lifecycle events such as save, remove, updateOne, findOne, or aggregate.
    ~Access to the Document or Query: 
        `In document middleware (e.g., save or remove), you have access to the document (this).`
        `In query middleware (e.g., find or updateOne), you can access and modify the query object.`
    ~Asynchronous or Synchronous: Can handle asynchronous operations using async/await or callbacks.
    ~Multiple Middleware Stacking: You can define multiple pre middleware functions, which are executed in the order they are defined.
    ~Control Execution Flow:You must call next() (or let it return in async functions) to proceed to the next middleware or operation.
# Types of pre Middleware
    ~Document Middleware
    ~Query Middleware
    ~Aggregate Middleware
    
# MongoDB Indexing
    ~MongoDB indexing is a mechanism to improve the speed and efficiency of database queries.
    ~An index is a data structure that helps MongoDB quickly locate documents that match the query conditions. 
    ~Without indexes, MongoDB has to perform a collection scan, which means it must examine every document in the collection to find the matching ones. This can be slow, especially for large collections.
# Why Use Indexing?
    ~Query Performance: Indexes drastically speed up query performance by reducing the number of documents that need to be scanned.
    ~Sort Performance: Indexes help optimize sorting operations on large datasets.
    ~Unique Constraints: Indexes can enforce uniqueness for fields (like ensuring no two documents have the same email).
# Two way to create index in mongoose
    ~you can add index: true to a field in your Mongoose schema to create an index for that field.
        `const groupSchema = new mongoose.Schema(
            {
                groupName: {
                type: String,
                required: true,
                trim: true,
                index: true, // Creates an index on groupName
                },
            })`
    ~Indexes are created automatically when you define them in the schema.
        `groupSchema.index({ groupName: 1 });` // Ascending index (1) for faster searches on groupName
# How Indexing Helps
    ~Faster Queries: Indexes reduce the number of documents that MongoDB needs to scan.
    ~Sorting Optimization: If you frequently query for groups and sort them by fieldName, the index on those fields will speed up sorting by avoiding full collection scans.
    ~Unique Constraints: The unique index on members.email prevents the insertion of duplicate emails in the members array, which can be helpful for ensuring data integrity.
# Managing Indexes in MongoDB
    ~Creating Indexes: `db.groups.createIndex({ groupName: 1 });`
    ~Viewing Indexes: `db.groups.getIndexes();`
    ~Dropping Indexes: `db.groups.dropIndex({ groupName: 1 });`
# Performance Considerations
    `Index Size: Indexes take up additional space in the database. Therefore, you should carefully consider which fields to index based on your query patterns.
    `Write Performance: While indexes improve read performance, they can slow down write operations because MongoDB must update the indexes each time a document is inserted, updated, or deleted.
    `Indexing Strategy: It’s important to test and analyze your queries before deciding which fields to index. 
    **Tools like MongoDB Atlas provide query performance insights to help you choose the right indexes.

