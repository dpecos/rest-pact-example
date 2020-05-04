class Repository {
  constructor() {
    this.entities = [];
  }

  fetchAll() {
    return this.entities;
  }

  getByName(name) {
    return this.entities.find((entity) => name == entity.name);
  }

  insert(entity) {
    this.entities.push(entity);
  }

  clear() {
    this.entities = [];
  }
}

module.exports = Repository;
