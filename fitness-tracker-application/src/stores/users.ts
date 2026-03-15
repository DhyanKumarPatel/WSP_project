import { defineStore } from 'pinia'
import { ref } from 'vue'
import usersData from '@/data/users.json'
import type { User } from '@/types'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>(usersData.users as User[])

  function getUserById(id: number) {
    return users.value.find((user) => user.id === id) || null
  }

  function addUser(newUser: Omit<User, 'id'>) {
    const nextId =
      users.value.length > 0
        ? Math.max(...users.value.map((user) => user.id)) + 1
        : 1

    users.value.push({
      id: nextId,
      ...newUser,
    })
  }

  function updateUser(updatedUser: User) {
    const index = users.value.findIndex((user) => user.id === updatedUser.id)
    if (index !== -1) {
      users.value[index] = { ...updatedUser }
    }
  }

  function deleteUser(id: number) {
    users.value = users.value.filter((user) => user.id !== id)
  }

  function emailExists(email: string, excludeUserId?: number) {
    return users.value.some(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.id !== excludeUserId,
    )
  }

  return {
    users,
    getUserById,
    addUser,
    updateUser,
    deleteUser,
    emailExists,
  }
})