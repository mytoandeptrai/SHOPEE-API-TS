import { DEFAULT_PAGING, ORDER, SORT_BY } from 'utils/constants';

// Constructors and object instances
export function APIFeatures(query: any, queryString: any) {
  this.query = query; // Products.find()
  this.queryString = queryString; // req.query

  this.paginating = () => {
    const page = this.queryString.page * 1 || DEFAULT_PAGING.CURRENT_PAGE;
    const limit = this.queryString.limit * 1 || DEFAULT_PAGING.LIMIT_PER_PAGE;
    const skip = limit * (page - 1);
    this.query = this.query.limit(limit).skip(skip);
    return this;
  };
  //this.query = Products.find().limit(limit).skip(skip)

  this.productSorting = () => {
    const sort = SORT_BY.includes(this.queryString.sort_by as string) ? this.queryString.sort_by : SORT_BY[0];
    const order = ORDER.includes(this.queryString.order as string) ? this.queryString.order : ORDER[0];
    const sortedCondition = { [sort as string]: order === 'desc' ? -1 : 1 };
    this.query = this.query.sort(sortedCondition);
    return this;
  };
  //this.query = Products.find().limit(limit).skip(skip).sort(sort)

  this.searching = () => {
    const search = this.queryString.search;
    if (search) {
      this.query = this.query.find({
        $text: { $search: search },
      });
    } else {
      this.query = this.query.find();
    }
    return this;
  };
  //this.query = Products.find().find({
  //     $text: { $search: search }
  //  }).limit(limit).skip(skip).sort(sort)

  this.filtering = () => {
    const queryObj = { ...this.queryString };

    const excludedFields = ['page', 'sort', 'limit', 'search'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, (match) => '$' + match);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  };

  //this.query = Products.find().find({
  //     {"price":{"$gt":"56.99"}}
  //  }).limit(limit).skip(skip).sort(sort)
}
