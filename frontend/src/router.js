import { createRouter, createWebHistory } from "vue-router";
import UsersList from "./components/UsersList.vue";
import EditUser from "./components/EditUser.vue";
const routes = [
  {
    path: "/",
    name: "UsersList",
    component: UsersList,
  },
  {
    path: "/edit/:userId?",
    name: "EditUser",
    component: EditUser,
  },
  // Add more routes as needed
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
