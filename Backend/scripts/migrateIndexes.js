const mongoose = require("mongoose");
require("dotenv").config();

async function migrateIndexes() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to database");

    const collection = mongoose.connection.collection("departmentalusers");

    // Get current indexes
    const indexes = await collection.indexes();
    console.log("Current indexes:", indexes);

    // Drop the old unique index on employeeId if it exists
    try {
      await collection.dropIndex("employeeId_1");
      console.log("Dropped old employeeId_1 index");
    } catch (err) {
      console.log("No employeeId_1 index to drop (or already dropped)");
    }

    // Create the new compound index
    await collection.createIndex(
      { employeeId: 1, department: 1 },
      { unique: true }
    );
    console.log("Created new compound index on employeeId + department");

    // Verify new indexes
    const newIndexes = await collection.indexes();
    console.log("New indexes:", newIndexes);

    console.log("Migration complete!");
    process.exit(0);
  } catch (error) {
    console.error("Migration error:", error);
    process.exit(1);
  }
}

migrateIndexes();