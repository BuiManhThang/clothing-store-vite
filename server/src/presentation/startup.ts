import CategoryService from '../application/category/categoryService'
import ColorService from '../application/color/colorService'
import ColorImageService from '../application/colorImage/colorImageService'
import DiscountService from '../application/discount/discountService'
import FileService from '../application/file/fileService'
import InventoryService from '../application/inventory/inventoryService'
import OrderService from '../application/order/orderService'
import OrderDetailService from '../application/orderDetail/orderDetailService'
import OrderDiscountService from '../application/orderDiscount/orderDiscountService'
import ProductService from '../application/product/productService'
import ProductDiscountService from '../application/productDiscount/productDiscountService'
import ReceiptService from '../application/receipt/receiptService'
import ReceiptDetailService from '../application/receiptDetail/receiptDetailService'
import RoleService from '../application/role/roleService'
import SizeService from '../application/size/sizeService'
import UserService from '../application/user/userService'
import UserAccountService from '../application/userAccount/userAccountService'
import MySqlCategoryRepo from '../infrastructure/mysqlCategoryRepo'
import MySqlColorImageRepo from '../infrastructure/mysqlColorImageRepo'
import MySqlColorRepo from '../infrastructure/mysqlColorRepo'
import MySqlDiscountRepo from '../infrastructure/mysqlDiscountRepo'
import MySqlFileRepo from '../infrastructure/mysqlFileRepo'
import MySqlInventoryRepo from '../infrastructure/mysqlInventoryRepo'
import MySqlOrderDetailRepo from '../infrastructure/mysqlOrderDetailRepo'
import MySqlOrderDiscountRepo from '../infrastructure/mysqlOrderDiscountRepo'
import MySqlOrderRepo from '../infrastructure/mysqlOrderRepo'
import MySqlProductDiscountRepo from '../infrastructure/mysqlProductDiscountRepo'
import MysqlProductRepo from '../infrastructure/mysqlProductRepo'
import MySqlReceiptDetailRepo from '../infrastructure/mysqlReceiptDetailRepo'
import MySqlReceiptRepo from '../infrastructure/mysqlReceiptRepo'
import MysqlRoleRepo from '../infrastructure/mysqlRoleRepo'
import MySqlSizeRepo from '../infrastructure/mysqlSizeRepo'
import MysqlUserAccountRepo from '../infrastructure/mysqlUserAccountRepo'
import MysqlUserRepo from '../infrastructure/mysqlUserRepo'
import CategoryController from './controller/categoryController'
import DiscountController from './controller/discountController'
import FileController from './controller/fileController'
import OrderController from './controller/orderController'
import ProductController from './controller/productController'
import ReceiptController from './controller/receiptController'
import RoleController from './controller/roleController'
import UserController from './controller/userController'

export const fileRepo = new MySqlFileRepo()
export const fileService = new FileService(fileRepo)
export const fileController = new FileController(fileService)

export const userAccountRepo = new MysqlUserAccountRepo()
export const userAccountService = new UserAccountService(userAccountRepo)

export const roleRepo = new MysqlRoleRepo()
export const roleService = new RoleService(roleRepo)
export const roleController = new RoleController(roleService)

export const userRepo = new MysqlUserRepo()
export const userService = new UserService(userRepo, userAccountService, roleService)
export const userController = new UserController(userService)

export const categoryRepo = new MySqlCategoryRepo()
export const categoryService = new CategoryService(categoryRepo)
export const categoryController = new CategoryController(categoryService)

export const inventoryRepo = new MySqlInventoryRepo()
export const inventoryService = new InventoryService(inventoryRepo)

export const colorImageRepo = new MySqlColorImageRepo()
export const colorImageService = new ColorImageService(colorImageRepo, fileService)

export const colorRepo = new MySqlColorRepo()
export const colorService = new ColorService(colorRepo, colorImageService)

export const sizeRepo = new MySqlSizeRepo()
export const sizeService = new SizeService(sizeRepo)

export const productDiscountRepo = new MySqlProductDiscountRepo()
export const productDiscountService = new ProductDiscountService(productDiscountRepo)

export const productRepo = new MysqlProductRepo()
export const productService = new ProductService(
  productRepo,
  colorService,
  sizeService,
  productDiscountService,
  colorImageService,
  categoryService
)
export const productController = new ProductController(productService)

export const discountRepo = new MySqlDiscountRepo()
export const discountService = new DiscountService(discountRepo)
export const discountController = new DiscountController(discountService)

export const receiptDetailRepo = new MySqlReceiptDetailRepo()
export const receiptDetailService = new ReceiptDetailService(receiptDetailRepo)

export const receiptRepo = new MySqlReceiptRepo()
export const receiptService = new ReceiptService(
  receiptRepo,
  productService,
  colorService,
  sizeService,
  receiptDetailService,
  inventoryService
)
export const receiptController = new ReceiptController(receiptService)

export const orderDiscountRepo = new MySqlOrderDiscountRepo()
export const orderDiscountService = new OrderDiscountService(orderDiscountRepo)

export const orderDetailRepo = new MySqlOrderDetailRepo()
export const orderDetailService = new OrderDetailService(orderDetailRepo)

export const orderRepo = new MySqlOrderRepo()
export const orderService = new OrderService(
  orderRepo,
  productService,
  colorService,
  sizeService,
  orderDetailService,
  inventoryService,
  orderDiscountService,
  discountService
)
export const orderController = new OrderController(orderService)
