import { faker } from "@faker-js/faker"
import { VideoDto } from "../../videos/types/dtos/video-dto.type"
import { Types } from "mongoose"
import { VideoModel } from "../../videos/models/video.model"

export const createFakeVideo = (): VideoDto => {
    return <VideoDto>{
        source: faker.internet.url(),
        thumbnail: faker.internet.url(),
        title: faker.commerce.productName(),
        description: faker.string.alphanumeric({ length: { min: 10, max: 5000 } }),
        creatorId: new Types.ObjectId("6700ff3f3360a283057cbefa")
    }
}

export const createFakeVideos = async (number: number): Promise<void> => {
    const videoNumber: number = await VideoModel.countDocuments().exec();

    if(videoNumber >= number) return;

    for (let i = 0; i < number - videoNumber; i++) {
        await VideoModel.create(createFakeVideo());
    }
}