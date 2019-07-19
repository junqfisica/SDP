export class AppUtil {

    static generateId(): string {
        /**
         * Generate an unique id of lenght 5.
         * 
         * This should not be used to create users ids, this is only for events in progress bar or none sensitive events. 
         * for sensitive informantio the uui are generete by the server. 
         */
        return Math.random().toString(36).substr(2, 5);
    }
}