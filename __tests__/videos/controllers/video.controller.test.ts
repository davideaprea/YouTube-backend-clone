import { describe, it } from "node:test";
import request from 'supertest';
import { app } from "../../../src";
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, disconnect } from "mongoose";
import { VideoModel } from "../../../src/videos/models/video.model";
import { createFakeVideo } from "../../../src/core/utilities/create-fake-video";

const endpoint: string = "/v1/videos"
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await connect(mongoUri);
});

afterAll(async () => {
    await disconnect();
    await mongoServer.stop();
});

describe('POST ' + endpoint, () => {
    it('should create a video successfully', async () => {
        const response = await VideoModel.create(createFakeVideo());

        expect(response).toHaveProperty('_id');
        expect(response.title).toBe('Test Video');
        expect(response.views).toBe(0);
        expect(response.dislikes).toBe(0);
        expect(response.likes).toBe(0);
    });

    it('should return 400 if video source is missing', async () => {
        const response = await request(app)
            .post(endpoint)
            .send({
                title: 'Test Video',
                thumbnail: 'path/to/thumbnail.jpg',
                creator: '507f1f77bcf86cd799439011',
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Video source file is missing.');
    });

    it('should return 400 if title is missing', async () => {
        const response = await request(app)
            .post(endpoint)
            .send({
                source: 'path/to/video.mp4',
                thumbnail: 'path/to/thumbnail.jpg',
                creator: '507f1f77bcf86cd799439011',
                description: 'A test video description',
                allowComments: true,
            });

        expect(response.status).toBe(400);
        expect(response.body.errors.title).toBeDefined();
    });

    it('should return 400 if creator ID is missing', async () => {
        const response = await request(app)
            .post(endpoint)
            .send({
                title: 'Test Video',
                source: 'path/to/video.mp4',
                thumbnail: 'path/to/thumbnail.jpg',
                description: 'A test video description',
                allowComments: true,
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toContain("User ID is missing.");
    });

    it('should return 400 if description exceeds maxlength', async () => {
        const longDescription = 'A'.repeat(5001); // 5001 caratteri
        const response = await request(app)
            .post(endpoint)
            .send({
                title: 'Test Video',
                source: 'path/to/video.mp4',
                thumbnail: 'path/to/thumbnail.jpg',
                creator: '507f1f77bcf86cd799439011',
                description: longDescription,
                allowComments: true,
            });

        expect(response.status).toBe(400);
        expect(response.body.errors.description).toBeDefined();
    });

    it('should return 400 if allowComments is not a boolean', async () => {
        const response = await request(app)
            .post(endpoint)
            .send({
                title: 'Test Video',
                source: 'path/to/video.mp4',
                thumbnail: 'path/to/thumbnail.jpg',
                creator: '507f1f77bcf86cd799439011',
                description: 'A test video description',
                allowComments: 'yes', // valore errato
            });

        expect(response.status).toBe(400);
        expect(response.body.errors.allowComments).toBeDefined();
    });

    it('should return 400 if chapters are invalid', async () => {
        const response = await request(app)
            .post(endpoint)
            .send({
                title: 'Test Video',
                source: 'path/to/video.mp4',
                thumbnail: 'path/to/thumbnail.jpg',
                creator: '507f1f77bcf86cd799439011',
                description: 'A test video description',
                allowComments: true,
                chapters: [
                    {
                        from: 5,
                        title: 'Chapter 1'
                    },
                    {
                        from: 8, // Non valido, meno di 10 secondi dalla precedente
                        title: 'Chapter 2'
                    }
                ]
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toContain("Every chapter must be at least 10 seconds long.");
    });

    it('should handle empty chapters', async () => {
        const response = await request(app)
            .post(endpoint)
            .send({
                title: 'Test Video',
                source: 'path/to/video.mp4',
                thumbnail: 'path/to/thumbnail.jpg',
                creator: '507f1f77bcf86cd799439011',
                description: 'A test video description',
                allowComments: true,
                chapters: [] // Senza capitoli
            });

        expect(response.status).toBe(201); // Dovrebbe andare a buon fine
        expect(response.body).toHaveProperty('_id');
    });

    it('should return 400 if the chapter title exceeds maxlength', async () => {
        const longTitle = 'A'.repeat(101); // 101 caratteri
        const response = await request(app)
            .post(endpoint)
            .send({
                title: 'Test Video',
                source: 'path/to/video.mp4',
                thumbnail: 'path/to/thumbnail.jpg',
                creator: '507f1f77bcf86cd799439011',
                description: 'A test video description',
                allowComments: true,
                chapters: [
                    {
                        from: 10,
                        title: longTitle // Titolo troppo lungo
                    }
                ]
            });

        expect(response.status).toBe(400);
        expect(response.body.errors.chapters[0].title).toBeDefined();
    });

    // Aggiungi ulteriori test per coprire altri casi se necessario
});