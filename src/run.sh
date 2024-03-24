npm install
# Wait for the database to be ready - better way to do this would be to wait for port to open
sleep 20
npm run migrate
npm run start
