import { ClientSession, startSession } from "mongoose";

export const transactionHandler = async <T = any>(cb: (session: ClientSession) => any): Promise<T> => {
    const session = await startSession();
    session.startTransaction();

    try {
        const res = await cb(session);

        await session.commitTransaction();

        return res;
    } catch (e) {
        await session.abortTransaction();

        throw e;
    } finally {
        session.endSession();
    }
}