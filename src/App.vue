<script setup>
import { ref, onMounted } from 'vue'

const pesanBaru = ref('')
const daftarPesan = ref([])

async function ambilPesan() {
  try {
    const res = await fetch('/api/messages')
    const data = await res.json()
    daftarPesan.value = data.map(d => `${d.name}: ${d.message}`)
  } catch (e) {
    console.error('Gagal ambil pesan:', e)
  }
}

async function tambahPesan() {
  if (pesanBaru.value.trim() !== '') {
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'User', // Bisa diganti dengan input nama kalau mau
          message: pesanBaru.value.trim()
        })
      })
      pesanBaru.value = ''
      ambilPesan()
    } catch (e) {
      console.error('Gagal kirim pesan:', e)
    }
  }
}

function hapusPesan(index) {
  daftarPesan.value.splice(index, 1)
  // Note: kamu bisa tambahkan API untuk hapus dari DB juga, kalau mau
}

onMounted(ambilPesan)
</script>

<template>
  <div class="pesan-board">
    <h2>Daftar Pesan</h2>
    <div class="form">
      <input v-model="pesanBaru" placeholder="Tulis pesan..." />
      <button @click="tambahPesan">Tambah</button>
    </div>

    <ul>
      <li v-for="(pesan, index) in daftarPesan" :key="index">
        {{ pesan }}
        <button class="hapus" @click="hapusPesan(index)">Hapus</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.pesan-board {
  max-width: 400px;
  margin: 30px auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 10px;
}

.form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

input {
  flex: 1;
  padding: 8px;
}

button {
  padding: 8px 12px;
  cursor: pointer;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  background: #eee;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  position: relative;
}

.hapus {
  position: absolute;
  right: 10px;
  top: 8px;
  background: red;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 3px;
}
</style>
