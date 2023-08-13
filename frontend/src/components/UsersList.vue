<script>
import axios from "axios";
import { useRouter } from "vue-router";

export default {
  name: "HelloWorld",
  setup() {
    const router = useRouter();

    const editUser = (user) => {
      console.log("here", user);
      router.push({ name: "EditUser", params: { userId: user.id } });
    };

    return {
      editUser,
    };
  },
  data() {
    return {
      users: [],
    };
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get("http://localhost:3000/users"); // Adjust URL
        console.log(response);
        this.users = response.data;
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },
    formatDate(dateString) {
      const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZoneName: "short",
      };
      return new Date(dateString).toLocaleString("en-US", options);
    },
    navigateToCreateUser() {
      this.$router.push({ name: "EditUser" });
    },
  },
};
</script>

<template>
  <div class="header">
    <h1 class="heading">User List</h1>
    <button class="btn" @click="navigateToCreateUser">Create User</button>
  </div>
  <div class="body">
    <table class="table" v-if="users.length > 0">
      <thead class="thead">
        <tr>
          <th>Name</th>
          <th>Address</th>
          <th>Date of Birth</th>
          <th>Phone Number</th>
          <th>Email</th>
          <th>Edit</th>
        </tr>
      </thead>
      <tbody class="tbody">
        <tr class="user-row" v-for="user in users" :key="user.id">
          <td class="user-data">
            <strong style="white-space: nowrap">{{ user.fullName }}</strong>
          </td>
          <td class="user-data">{{ user.address }}</td>
          <td class="user-data">{{ formatDate(user.dateOfBirth) }}</td>
          <td class="user-data">{{ user.phoneNumber }}</td>
          <td class="user-data">{{ user.email }}</td>
          <td>
            <button class="btn" @click="editUser(user)">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>
    <p class="else" v-else>No users to display.</p>
  </div>
</template>

<style scoped>
.header {
  background: aliceblue;
  padding: 10px;
  margin-bottom: 20px;
}
.else {
  text-align: center;
  font-size: 30px;
  font-family: sans-serif;
  font-weight: bold;
}

h1.heading {
  font-size: 40px;
  font-family: sans-serif;
  text-align: center;
}

button.btn {
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: aquamarine;
  font-size: 16px;
  font-family: sans-serif;
  margin: 0 10px;
  cursor: pointer;
  color: black;
}
thead.thead {
  font-size: 25px;
  background: lightgray;
}
table.table {
  border-collapse: collapse;
  font-family: sans-serif;
}
tr.user-row {
  border-bottom: 1px solid aquamarine;
}
td.user-data {
  border: 1px solid aquamarine;
  padding: 10px;
}

tbody.tbody {
  text-align: center;
}
</style>
