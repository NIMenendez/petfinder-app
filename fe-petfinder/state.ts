

const state: any = {
  data: {

  },

  subscribers: [] as Function[],

  subscribe(callback: Function) {
    this.subscribers.push(callback);
  },

  getState() {
    return this.data;
  },

  setState(newState: Partial<typeof state.data>) {
    this.data = {
      ...this.data,
      ...newState,
    };

    this.subscribers.forEach((callback: Function) => callback(this.data));

  }

  
}