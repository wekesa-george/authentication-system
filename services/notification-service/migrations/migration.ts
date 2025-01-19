const fs = require('fs');
const { Client } = require('pg');
require('dotenv').config();

// Function to read a file asynchronously
function readFileAsync(filePath) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

// Function to replace all occurrences of a string in a text
function replaceAll(text, searchStr, replaceStr) {
    return text.split(searchStr).join(replaceStr);
}

// Function to check if required process.env variables are not null
function checkEnvVariables() {
    const requiredVariables = ['DB_USER', 'DB_HOST', 'DB_DATABASE', 'DB_PASSWORD', 'DB_PORT', 'DB_SCHEMA'];
    requiredVariables.forEach(variable => {
        if (!process.env[variable]) {
            throw new Error(`Environment variable ${variable} is not defined.`);
        }
    });
}

// Replace occurrences of "my_schema" with "new_schema" in the SQL script
async function modifySQLScript(filePath) {
    try {
        let sqlScript = await readFileAsync(filePath);
        sqlScript = replaceAll(sqlScript, 'my_schema', process.env.DB_SCHEMA);
        return sqlScript;
    } catch (error) {
        console.error('Error reading or modifying SQL script:', error);
        throw error;
    }
}

// Connect to PostgreSQL and execute modified SQL script
async function executeSQL(sqlScript) {
    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });

    try {
        await client.connect();
        await client.query(sqlScript);
        console.log('SQL script executed successfully.');
    } catch (error) {
        console.error('Error executing SQL script:', error);
    } finally {
        await client.end();
    }
}

// Entry point
async function main() {
    try {
        checkEnvVariables(); // Check if required process.env variables are not null
        const modifiedSQL = await modifySQLScript('./migrations/source.sql');
        await executeSQL(modifiedSQL);
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// Start the script
main();
