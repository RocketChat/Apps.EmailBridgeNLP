import {
    IHttp,
    IModify,
    IPersistence,
    IRead,
} from '@rocket.chat/apps-engine/definition/accessors';
import {
    IUIKitResponse,
    UIKitViewCloseInteractionContext,
} from '@rocket.chat/apps-engine/definition/uikit';

import { EmailBridgeNlpApp } from '../../EmailBridgeNlpApp';

export class ExecuteViewClosedHandler {
    private context: UIKitViewCloseInteractionContext;
    
    constructor(
        protected readonly app: EmailBridgeNlpApp,
        protected readonly read: IRead,
        protected readonly http: IHttp,
        protected readonly persistence: IPersistence,
        protected readonly modify: IModify,
        context: UIKitViewCloseInteractionContext,
    ) {
        this.context = context;
    }

    public async handleActions(): Promise<IUIKitResponse> {
        const { user, view } = this.context.getInteractionData();

        // Handle any future view close interactions here
        // This could be cleanup when modals are closed, etc.

        return this.context.getInteractionResponder().successResponse();
    }
} 