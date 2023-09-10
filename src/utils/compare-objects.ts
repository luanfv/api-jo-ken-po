class CompareObjects {
  static isEqual(object1, object2): boolean {
    const key1 = Object.keys(object1);
    const key2 = Object.keys(object2);

    if (key1.length !== key2.length) {
      return false;
    }

    for (const key of key1) {
      if (object1[key] !== object2[key]) {
        return false;
      }
    }

    return true;
  }
}

export { CompareObjects };
