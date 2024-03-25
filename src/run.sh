npm install
# Wait for the database to be ready - better way to do this would be to wait for port to open
echo "Waiting for database to be ready..."
sleep 60
echo "Database should be ready now"
npm run migrate
npm run start
