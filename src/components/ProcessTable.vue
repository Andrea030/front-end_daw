<template>
  <q-table
    title="System Processes"
    :rows="rows"
    :columns="columns"
    row-key="pid"
    flat
    bordered
  />
</template>

<script setup>
const columns = [
  { name: 'pid', label: 'PID', field: 'pid', align: 'left' },
  { name: 'user', label: 'USER', field: 'user', align: 'left' },
  { name: 'command', label: 'COMMAND', field: 'command', align: 'left' },
  { name: 'cpu', label: 'CPU%', field: 'cpu', align: 'right' },
  { name: 'mem', label: 'MEM%', field: 'mem', align: 'right' }
]

const rows = [
  { pid: 18658, user: 'clamav', command: 'clamd', cpu: 0, mem: 28.1 },
  { pid: 1865, user: 'mysql', command: 'mysqld', cpu: 0, mem: 6.9 },
  { pid: 25112, user: 'amavis', command: '/usr/sbin/a+', cpu: 0, mem: 6.4 },
]
</script>