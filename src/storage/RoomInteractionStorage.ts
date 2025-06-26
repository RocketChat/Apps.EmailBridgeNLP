import { IPersistence, IPersistenceRead } from '@rocket.chat/apps-engine/definition/accessors';
import { RocketChatAssociationModel, RocketChatAssociationRecord } from '@rocket.chat/apps-engine/definition/metadata';

export class RoomInteractionStorage {
    constructor(
        private readonly persistence: IPersistence,
        private readonly persistenceRead: IPersistenceRead,
        private readonly userId: string,
    ) {}

    public async storeInteractionRoomId(roomId: string): Promise<void> {
        const association = new RocketChatAssociationRecord(
            RocketChatAssociationModel.USER,
            `${this.userId}-room-interaction`,
        );
        
        const data = { roomId: roomId };
        
        await this.persistence.updateByAssociation(
            association,
            data,
            true,
        );
    }

    public async getInteractionRoomId(): Promise<string | null> {
        const association = new RocketChatAssociationRecord(
            RocketChatAssociationModel.USER,
            `${this.userId}-room-interaction`,
        );
        
        const result = await this.persistenceRead.readByAssociation(association);
        if (result && result.length > 0) {
            const data = result[0] as { roomId?: string };
            return data.roomId || null;
        }
        return null;
    }

    public async clearInteractionRoomId(): Promise<void> {
        const association = new RocketChatAssociationRecord(
            RocketChatAssociationModel.USER,
            this.userId,
        );
        
        await this.persistence.removeByAssociation(association);
    }
} 