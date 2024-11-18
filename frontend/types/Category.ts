export interface ICategory {
  userId?: string;
  name: string;
  isDefault: boolean;
}

export interface IUserCategoryBlacklist {
  userId: string;
  categoryName: string;
}
