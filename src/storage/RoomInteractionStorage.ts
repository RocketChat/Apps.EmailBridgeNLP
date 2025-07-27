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

    public async storeInteractionMessageId(messageId: string): Promise<void> {
        const association = new RocketChatAssociationRecord(
            RocketChatAssociationModel.USER,
            `${this.userId}-room-interaction`,
        );

        const currentData = await this.getInteractionData() || {};
        const newData = { ...currentData, messageId };

        await this.persistence.updateByAssociation(
            association,
            newData,
            true,
        );
    }

    public async getInteractionMessageId(): Promise<string | null> {
        const data = await this.getInteractionData();
        return data?.messageId || null;
    }

    private async getInteractionData(): Promise<{ roomId?: string, messageId?: string } | null> {
        const association = new RocketChatAssociationRecord(
            RocketChatAssociationModel.USER,
            `${this.userId}-room-interaction`,
        );

        const result = await this.persistenceRead.readByAssociation(association);
        if (result && result.length > 0) {
            return result[0] as { roomId?: string, messageId?: string };
        }
        return null;
    }

    public async clearInteractionRoomId(): Promise<void> {
        const association = new RocketChatAssociationRecord(
            RocketChatAssociationModel.USER,
            `${this.userId}-room-interaction`,
        );
        
        await this.persistence.removeByAssociation(association);
    }
} 