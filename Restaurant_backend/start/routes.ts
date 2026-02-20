import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

// Controllers
const AuthController = () => import('#controllers/auth_controller')
const MenuController = () => import('#controllers/menus_controller')
const TablesController = () => import('#controllers/tables_controller')
const ReservationsController = () => import('#controllers/reservations_controller')
const OrdersController = () => import('#controllers/order_controller')

router.group(() => {
  router.post('/signup', [AuthController, 'signup'])
  router.post('/login', [AuthController, 'login'])

  router.group(() => {

    // CUSTOMER ROUTES (Role ID: 1, 2, 3)
    router.group(() => {
      router.get('/availability', [ReservationsController, 'checkAvailability'])
      router.post('/reservations', [ReservationsController, 'store'])
      router.get('/menu', [MenuController, 'index'])
      router.get('/my-reservations', [ReservationsController, 'myReservations'])
      router.post('/orders', [OrdersController, 'store'])
      router.patch('/orders/:id/cancel', [OrdersController, 'cancel']).where('id', router.matchers.number())
      router.get('/my-orders', [OrdersController, 'index'])
    })
    .prefix('/customer')
    .use(middleware.role([1, 2, 3]))


    // STAFF ROUTES (Role ID: 2, 3)
    router.group(() => {
      router.get('/reservations', [ReservationsController, 'index'])
      router.get('/menu',[MenuController,'adminIndex'])
      router.patch('/reservations/:id/status', [ReservationsController, 'updateStatus']).where('id', router.matchers.number())
      router.get('/kitchen/orders', [OrdersController, 'kitchenView'])
      router.patch('/orders/:id/status', [OrdersController, 'updateStatus']).where('id', router.matchers.number())
      
      router.patch('/menu/:id/toggle', [MenuController, 'toggleAvailability']).where('id', router.matchers.number())
    })
    .prefix('/staff')
    .use(middleware.role([2, 3]))

    //ADMIN ROUTES (Role ID: 3)
    router.group(() => {
      router.post('/menu', [MenuController, 'store'])
      router.patch('/menu/:id', [MenuController, 'update']).where('id', router.matchers.number())
      router.get('/tables', [TablesController, 'adminIndex'])
      router.post('/tables', [TablesController, 'store'])
      router.patch('/tables/:id', [TablesController, 'update']).where('id', router.matchers.number())
    })
    .prefix('/admin')
    .use(middleware.role([3]))

  }).use(middleware.jwtAuth())

}).prefix('/api/')