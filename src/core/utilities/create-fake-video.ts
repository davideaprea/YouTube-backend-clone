import { faker } from "@faker-js/faker"
import { Types } from "mongoose"
import { VideoModel } from "../../videos/models/video.model"
import { Video } from "../../videos/types/video.type"

export const createFakeVideo = (): Video => {
    return <Video>{
        source: faker.internet.url(),
        thumbnail: faker.internet.url(),
        title: faker.commerce.productName(),
        description: faker.string.alphanumeric({ length: { min: 10, max: 5000 } }),
        userId: new Types.ObjectId("670a4a6c7f85a46d78e936c3")
    }
}

export const createFakeVideos = async (number: number): Promise<void> => {
    const videoNumber: number = await VideoModel.countDocuments().exec();

    if(videoNumber >= number) return;

    for (let i = 0; i < number - videoNumber; i++) {
        await VideoModel.create(createFakeVideo());
    }
}