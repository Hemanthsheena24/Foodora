#!/bin/bash
# Docker entrypoint script for seeding the database

echo "Waiting for MongoDB to be ready..."
sleep 10

echo "Running database seeder..."
node seed.js

echo "Database seeding completed!"