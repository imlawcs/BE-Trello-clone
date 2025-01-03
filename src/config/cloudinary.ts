import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const requiredEnvVars = {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
};

const missingEnvVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
}

console.log("Cloudinary Configuration Status:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? "✓ Loaded" : "✗ Missing",
    api_secret: process.env.CLOUDINARY_API_SECRET ? "✓ Loaded" : "✗ Missing"
});

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!, 
    api_key: process.env.CLOUDINARY_API_KEY!, 
    api_secret: process.env.CLOUDINARY_API_SECRET!
});

try {
    const testConfig = cloudinary.config();
    if (!testConfig.api_key || !testConfig.api_secret || !testConfig.cloud_name) {
        throw new Error('Cloudinary configuration validation failed');
    }
    console.log('✓ Cloudinary configured successfully');
} catch (error) {
    console.error('✗ Cloudinary configuration error:', error);
    throw error;
}

export default cloudinary;