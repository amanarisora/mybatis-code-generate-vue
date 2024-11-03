import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', {
    state: () => ({
        loginUser: localStorage.getItem('loginUser') || '',
        indexWidth: 300
    }),
    actions: {
        setUser(username) {
            this.loginUser = username;
            localStorage.setItem('loginUser', this.loginUser);
        }
    }
});