class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query.limit(limit).skip(skip);
    return this;
  }

  sort() {
    // /products?sort=price,-createdAt
    console.log(this.queryString);
    if (this.queryString.sort) {
      this.queryString.sort = this.queryString.sort.split(",").join(" ");
      this.query.sort(`${this.queryString.sort} -createdAt`);
    }
    return this;
  }

  limitFields() {
    // /products?fields=-category
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query.select(fields);
    }
    return this;
  }
}

module.exports = APIFeatures;
