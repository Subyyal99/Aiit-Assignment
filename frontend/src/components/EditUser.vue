<template>
  <div class="edit-user">
    <h1 class="heading">{{ userId ? "Edit User" : "Create User" }}</h1>
    <form class="form" @submit.prevent="handleSubmit">
      <label class="label" for="fullName">Full Name:</label>
      <input
        class="input"
        type="text"
        id="fullName"
        v-model="user.fullName"
        required
      />
      <span class="error-message">{{ errors.fullName }}</span>

      <label class="label" for="address">Address:</label>
      <input class="input" type="text" id="address" v-model="user.address" />

      <label class="label" for="dateOfBirth">Date of Birth:</label>
      <input
        class="input"
        type="text"
        id="dateOfBirth"
        v-model="user.dateOfBirth"
        required
      />
      <span class="error-message">{{ errors.dateOfBirth }}</span>

      <label class="label" for="phoneNumber">Phone Number:</label>
      <input
        class="input"
        type="text"
        id="phoneNumber"
        v-model="user.phoneNumber"
        required
        @input="validatePhoneNumber"
      />
      <span class="error-message">{{ errors.phoneNumber }}</span>

      <label class="label" for="email">Email:</label>
      <input
        class="input"
        type="email"
        id="email"
        v-model="user.email"
        required
        @input="validateEmail"
      />
      <span class="error-message">{{ errors.email }}</span>

      <button class="btn" type="submit" :disabled="hasErrors">
        {{ userId ? "Update" : "Create" }}
      </button>
      <button class="btn2" @click="navigateTouserList" v-if="userId">
        Cancel
      </button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import router from "../router";

export default {
  name: "EditUser",
  data() {
    return {
      userId: this.$route.params.userId,
      user: {
        fullName: "",
        address: "",
        dateOfBirth: "",
        phoneNumber: "",
        email: "",
      },
      errors: {},
    };
  },
  methods: {
    async handleSubmit() {
      if (this.validateForm()) {
        try {
          if (this.userId) {
            // Update existing user
            await axios.put(
              `http://localhost:3000/update/${this.userId}`,
              this.user
            );
          } else {
            // Create new user
            await axios.post("http://localhost:3000/insert", this.user);
          }
          this.$router.push("/");
        } catch (error) {
          alert(error.response.data.error);
          console.error("Error saving user:", error);
        }
      }
    },
    validatePhoneNumber() {
      const phoneNumberRegex = /^[0-9]+$/;
      if (!phoneNumberRegex.test(this.user.phoneNumber)) {
        this.errors.phoneNumber =
          "Phone number is required & contain only digits.";
      } else {
        delete this.errors.phoneNumber;
      }
    },
    validateEmail() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.user.email)) {
        this.errors.email = "Invalid email address.";
      } else {
        delete this.errors.email;
      }
    },
    validateForm() {
      this.errors = {};
      let isValid = true;

      if (!this.user.fullName.trim()) {
        this.errors.fullName = "Full name is required.";
        isValid = false;
      }

      if (!this.user.dateOfBirth.trim()) {
        this.errors.dateOfBirth = "Date of Birth is required.";
        isValid = false;
      }
      this.validatePhoneNumber();
      this.validateEmail();
      return isValid;
    },
    navigateTouserList() {
      router.pop();
    },
  },
  mounted() {
    if (this.userId) {
      axios
        .get(`http://localhost:3000/users/${this.userId}`)
        .then((response) => {
          this.user = response.data;
        })
        .catch((error) => {
          console.error("Error fetching user:", error);
        });
    }
  },
};
</script>

<style>
.error-message {
  display: block;
    color: red;
    font-size: 13px;
    margin-bottom: 2px;
}
.edit-user {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.form {
  width: 400px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
}

.form-group {
  margin-bottom: 15px;
}

.label {
  font-weight: bold;
  font-size: 20px;
    font-family: sans-serif;
}

.input {
    width: 96%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin: 10px 0;
}

.error-message {
  color: red;
  font-size: 12px;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;  
  margin-right: 15px;

}

.btn2 {
  padding: 10px 20px;
  background-color: #ccc;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
