export type VideoDto = {
    readonly creatorId: string,
    title: string,
    description: string,
    source: Express.Multer.File
}