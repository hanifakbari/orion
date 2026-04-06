import {
  CommandAnalysis,
  DangerousCommand,
  QuickPrompt,
  ChatSuggestion,
} from "../types";

export const DANGEROUS_COMMANDS: DangerousCommand[] = [
  { pattern: "rm -rf /", level: "critical", desc: "System wipe" },
  { pattern: "rm -rf /*", level: "critical", desc: "System wipe variant" },
  {
    pattern: "dd if=/dev/zero of=/dev/sda",
    level: "critical",
    desc: "Disk destruction",
  },
  {
    pattern: "dd if=/dev/random of=/dev/sda",
    level: "critical",
    desc: "Disk destruction",
  },
  {
    pattern: "mkfs.ext4 /dev/sda",
    level: "critical",
    desc: "Format system disk",
  },
  {
    pattern: "mkfs.ext3 /dev/sda",
    level: "critical",
    desc: "Format system disk",
  },
  {
    pattern: "mkfs.xfs /dev/sda",
    level: "critical",
    desc: "Format system disk",
  },
  { pattern: "mv / /dev/null", level: "critical", desc: "Move root to null" },
  { pattern: "mv /* /dev/null", level: "critical", desc: "Move all to null" },
  { pattern: ":(){ :|:& };:", level: "critical", desc: "Fork bomb" },
  { pattern: "rm -rf", level: "warning", desc: "Recursive force delete" },
  { pattern: "sudo rm", level: "warning", desc: "Sudo delete" },
  { pattern: "sudo dd", level: "warning", desc: "Sudo disk op" },
  { pattern: "kubectl delete", level: "warning", desc: "Delete k8s resources" },
  { pattern: "docker rm -f", level: "warning", desc: "Force remove container" },
  {
    pattern: "docker system prune -a",
    level: "warning",
    desc: "Remove all unused data",
  },
  { pattern: "curl.*|.*sh", level: "warning", desc: "Pipe curl to shell" },
  { pattern: "wget.*|.*bash", level: "warning", desc: "Pipe wget to bash" },
];

export const ANALYSIS_DATABASE: CommandAnalysis[] = [
  {
    patterns: ["docker system prune -a"],
    impacts: [
      "Menghapus semua unused images termasuk tagged images",
      "Mengembalikan ~4.8 GB disk space",
      "Build cache dihapus total (next build ~50% lebih lambat)",
      "Container yang sedang berjalan tidak terpengaruh",
    ],
    duration: "~20 detik",
    space: "4.8 GB",
    risk: "Medium",
    riskColor: "amber",
  },
  {
    patterns: ["docker system prune"],
    impacts: [
      "Membersihkan dangling images dan container",
      "Mengembalikan ~2.3 GB disk space",
      "Build cache dihapus (next build ~30% lebih lambat)",
      "Container berjalan tidak terpengaruh",
    ],
    duration: "~10 detik",
    space: "2.3 GB",
    risk: "Low",
    riskColor: "green",
  },
  {
    patterns: ["docker rm -f"],
    impacts: [
      "Container dihentikan paksa dan dihapus permanen",
      "Data dalam container (bukan volume) hilang",
      "Volume yang di-mount tidak terpengaruh",
      "Image tetap tersedia untuk container baru",
    ],
    duration: "~3 detik",
    space: "150 MB",
    risk: "Medium",
    riskColor: "amber",
  },
  {
    patterns: ["rm -rf /", "rm -rf /*"],
    impacts: [
      "MENGHAPUS SELURUH SISTEM — tidak dapat dipulihkan",
      "OS, data, konfigurasi, dan semua file hilang",
      "Server tidak dapat di-boot ulang",
      "Recovery tidak mungkin tanpa full backup eksternal",
    ],
    duration: "Permanen",
    space: "100%",
    risk: "Critical",
    riskColor: "amber",
  },
  {
    patterns: ["rm -rf", "sudo rm"],
    impacts: [
      "Menghapus file dan direktori secara rekursif dan permanen",
      "Tidak ada konfirmasi tambahan — langsung dieksekusi",
      "Tidak dapat di-undo tanpa backup",
      "Proses yang mengakses file tersebut bisa crash",
    ],
    duration: "Varies",
    space: "Varies",
    risk: "High",
    riskColor: "amber",
  },
  {
    patterns: ["kubectl delete"],
    impacts: [
      "Resource Kubernetes yang ditarget akan dihapus dari cluster",
      "Deployment yang terhubung mungkin mengalami restart",
      "Resource tidak langsung dapat di-restore",
      "Apply ulang manifest YAML diperlukan untuk restore",
    ],
    duration: "~5-30 detik",
    space: "0 MB",
    risk: "Medium",
    riskColor: "amber",
  },
  {
    patterns: ["dd if=/dev/zero", "dd if=/dev/random", "sudo dd"],
    impacts: [
      "Menimpa seluruh isi disk dengan data nol/random",
      "Semua partisi dan filesystem akan rusak total",
      "Recovery tidak mungkin tanpa backup penuh",
      "Sistem akan crash selama proses berlangsung",
    ],
    duration: "Permanen",
    space: "100%",
    risk: "Critical",
    riskColor: "amber",
  },
  {
    patterns: ["curl.*|.*sh", "wget.*|.*bash"],
    impacts: [
      "Script dari internet dieksekusi langsung tanpa review",
      "Risiko supply chain attack atau malicious code",
      "Tidak ada kontrol atas apa yang diinstal",
      "Best practice: download → review → eksekusi manual",
    ],
    duration: "Varies",
    space: "Varies",
    risk: "High",
    riskColor: "amber",
  },
];

export const PINNED_CHATS = [
  {
    id: "1",
    title: "Monitoring CPU Alert",
    meta: "Pinned • 15 pesan",
    icon: "star",
    pinned: true,
  },
  {
    id: "2",
    title: "Docker Cleanup Script",
    meta: "Pinned • 8 pesan",
    icon: "star",
    pinned: true,
  },
];

export const PROJECTS = [
  { id: "1", name: "Production Cluster", count: 12, color: "#00d9ff" },
  { id: "2", name: "Staging Environment", count: 5, color: "#00ff88" },
  { id: "3", name: "K8s Migration", count: 3, color: "#ffb800" },
  { id: "4", name: "DR Testing", count: 7, color: "#ff2d55" },
];

export const TODAY_CHATS = [
  {
    id: "3",
    title: "Optimasi sistem Ubuntu",
    meta: "10:30 • 12 pesan",
    icon: "laptop-code",
    active: true,
  },
  {
    id: "4",
    title: "Pembersihan storage otomatis",
    meta: "09:15 • 8 pesan",
    icon: "broom",
  },
];

export const WEEK_CHATS = [
  {
    id: "5",
    title: "Monitoring performa CPU",
    meta: "Senin • 15 pesan",
    icon: "chart-line",
  },
  {
    id: "6",
    title: "Konfigurasi Docker container",
    meta: "Minggu • 23 pesan",
    icon: "tools",
  },
];

export const QUICK_PROMPTS: QuickPrompt[] = [
  {
    id: 1,
    title: "Analisis Kode Snippet",
    description: "Dapatkan analisis keamanan untuk potongan kode",
    prompt:
      "Analisis kode ini: console.log('Hello World'); if (true) { console.log('Safe'); }",
    type: "code",
    response: {
      type: "ai",
      content:
        "Kode ini aman untuk dieksekusi dan hanya melakukan operasi logging sederhana ke console. Kode ini tidak membuka file, tidak melakukan request jaringan, dan tidak mengubah data apa pun. Sebagai ringkasan:\n\n- Memanggil `console.log` sekali untuk menampilkan teks.\n- Menggunakan kontrol kondisi `if (true)` yang selalu benar.\n- Tidak ada akses disk, tidak ada operasi jaringan, dan tidak ada mutasi state global.\n\nIni cocok digunakan sebagai contoh edukasi atau debug ringan.",
      codeSnippet: `console.log('Hello World');
if (true) {
  console.log('Safe');
}`,
      language: "javascript",
      analysis: {
        risk: "Low",
        riskColor: "green",
        impacts: [
          "Hanya melakukan console logging",
          "Tidak ada akses ke file system",
          "Tidak ada operasi jaringan",
          "Tidak ada modifikasi data",
        ],
        duration: "~1ms",
        space: "0 MB",
      },
    },
  },
  {
    id: 2,
    title: "Perintah Terminal Bash",
    description: "Analisis perintah bash untuk risiko keamanan",
    prompt: "ls -la /home/user",
    type: "terminal",
    response: {
      type: "ai",
      content:
        "Perintah `ls -la /home/user` membaca isi direktori home pengguna secara aman. Ini menampilkan nama file, hak akses, ukuran berkas, pemilik, grup, dan timestamp terakhir diubah. Perintah ini tidak membuat, menghapus, atau mengubah file.\n\nGunakan perintah ini untuk memeriksa struktur folder, memastikan izin sudah benar, atau menemukan file tersembunyi sebelum melakukan operasi lebih berisiko.",
      codeSnippet: "ls -la /home/user",
      language: "bash",
      analysis: {
        risk: "Low",
        riskColor: "green",
        impacts: [
          "Hanya membaca daftar file",
          "Tidak memodifikasi file apa pun",
          "Tidak menghapus atau membuat file",
          "Informasi permission ditampilkan untuk audit",
        ],
        duration: "~50ms",
        space: "0 MB",
      },
    },
  },
  {
    id: 3,
    title: "Operasi File Sistem",
    description: "Periksa operasi file yang berpotensi berbahaya",
    prompt: "rm -rf /tmp/cache/*",
    type: "filesystem",
    response: {
      type: "dangerous",
      content:
        "⚠️ **PERINGATAN KRITIS** - Perintah ini menghapus semua file di direktori cache secara rekursif dan permanen!",
      severity: "warning",
      codeSnippet: "rm -rf /tmp/cache/*",
      language: "bash",
      analysis: {
        risk: "High",
        riskColor: "amber",
        impacts: [
          "Menghapus semua file di /tmp/cache/",
          "Operasi bersifat permanen (tidak dapat di-undo)",
          "Cache aplikasi akan hilang",
          "Aplikasi mungkin perlu rebuild cache",
          "Risiko: cache yang penting terhapus",
        ],
        duration: "~2 detik",
        space: "~500 MB",
      },
    },
  },
  {
    id: 4,
    title: "Perintah Sistem",
    description: "Evaluasi perintah sistem untuk dampaknya",
    prompt: "sudo systemctl restart nginx",
    type: "system",
    response: {
      type: "ai",
      content:
        "Perintah ini akan merestart service nginx menggunakan hak administrator. Restart nginx biasanya dilakukan ketika konfigurasi baru sudah diterapkan atau ketika service tidak merespons dengan benar. Selama restart, koneksi baru mungkin ditolak sementara dan sesi aktif dapat terputus.\n\nPastikan konfigurasi nginx valid sebelum menjalankan perintah ini, karena restart gagal dapat menyebabkan downtime lebih lama.",
      codeSnippet: "sudo systemctl restart nginx",
      language: "bash",
      analysis: {
        risk: "Medium",
        riskColor: "amber",
        impacts: [
          "Nginx service akan restart",
          "Downtime ~2-5 detik selama restart",
          "Koneksi aktif mungkin terputus",
          "Load balancer health check mungkin fail sementara",
          "Konfigurasi nginx akan di-reload",
        ],
        duration: "~3 detik",
        space: "0 MB",
      },
    },
  },
];

export const CHAT_SUGGESTIONS: ChatSuggestion[] = [
  {
    id: 1,
    text: "Scale nginx",
    icon: "maximize",
    command: "Scale deployment nginx ke 5 replicas",
    response: {
      type: "ai",
      content:
        "<strong>Scaling Deployment Nginx - Plan Execution</strong><br/><br/>Saya telah merencanakan peningkatan replica nginx dari jumlah current menjadi 5 instance. Ini adalah langkah strategis untuk meningkatkan availability dan performance. Mari kita lihat detail rencana ini:<br/><br/><strong>Keuntungan Scaling Ke 5 Replica:</strong><br/>• Peningkatan kapasitas throughput hingga 5x<br/>• High availability - jika 1 pod down, masih ada 4 lainnya<br/>• Load balancing yang lebih baik across pod<br/>• No downtime selama proses scaling<br/>• Dapat di-rollback jika ada masalah<br/><br/><strong>Resource Yang Dibutuhkan:</strong><br/>• CPU: 5 x (nginx CPU request)<br/>• Memory: 5 x (nginx memory request)<br/>• Network bandwidth: distributed across replicas<br/><br/>Setelah scaling selesai, pastikan untuk monitor metrics dan traffic distribution untuk memastikan semua pod berfungsi optimal.",
      codeSnippet: "kubectl scale deployment nginx --replicas=5",
      language: "bash",
      analysis: {
        risk: "Low",
        riskColor: "green",
        impacts: [
          "Menambah jumlah replica nginx menjadi 5",
          "Meningkatkan kapasitas handling traffic",
          "Tidak ada downtime selama scaling",
          "Memerlukan resources tambahan pada node",
        ],
        duration: "~15 detik",
        space: "0 MB",
      },
    },
  },
  {
    id: 2,
    text: "Restart error pods",
    icon: "refresh",
    command: "Restart pod yang error di namespace default",
    response: {
      type: "ai",
      content:
        "<strong>Analisis Pod Error Terdeteksi</strong><br/><br/>Saya telah mengidentifikasi pod dengan status error di namespace default. Berikut adalah breakdown masalah dan solusi yang akan diterapkan:<br/><br/><strong>Status Pod Yang Bermasalah:</strong><br/>• CrashLoopBackOff - Pod crash dan restart berulang kali<br/>• Error/Failed - Pod gagal saat startup atau runtime<br/>• ImagePullBackOff - Gagal pull image dari registry<br/>• OutOfMemory - Pod kehabisan memori dan di-kill<br/><br/><strong>Tindakan Yang Akan Dilakukan:</strong><br/>1. Menghentikan pod yang error<br/>2. Controller akan mem-reschedule pod baru<br/>3. Melakukan health check otomatis<br/>4. Monitoring logs untuk diagnosis<br/><br/>Setelah restart selesai, pastikan untuk review logs dan event pod untuk memahami root cause sebelum terjadi error lagi.",
      codeSnippet:
        "kubectl get pods -n default | grep -E 'CrashLoopBackOff|Error' | awk '{print $1}' | xargs kubectl delete pod -n default",
      language: "bash",
      analysis: {
        risk: "Medium",
        riskColor: "amber",
        impacts: [
          "Restart pod error di namespace default",
          "Sesi yang berjalan pada pod lama akan terputus",
          "Pod baru akan di-create kembali oleh controller",
          "Monitoring health check diperlukan setelah restart",
        ],
        duration: "~30 detik",
        space: "0 MB",
      },
    },
  },
  {
    id: 3,
    text: "Backup etcd",
    icon: "database",
    command: "Backup etcd cluster",
    response: {
      type: "ai",
      content:
        "<strong>Backup Cluster etcd Dijadwalkan</strong><br/><br/>Snapshot etcd akan mencakup seluruh state cluster Kubernetes yang kritis untuk disaster recovery. Berikut adalah detail komprehensif dari backup:<br/><br/><strong>Data Yang Di-backup:</strong><br/>• Konfigurasi Deployment, Service, dan Pod<br/>• Secret dan ConfigMap yang tersimpan<br/>• RBAC roles dan bindings<br/>• PersistentVolume dan PersistentVolumeClaim metadata<br/>• Namespace dan resource quota settings<br/>• etcd cluster state dan members info<br/><br/><strong>Keuntungan Backup Ini:</strong><br/>• Dapat restore cluster dari snapshot kapan saja<br/>• Aman untuk disaster recovery scenario<br/>• Non-disruptive terhadap operasi cluster<br/>• Dapat di-verify sebelum digunakan untuk restore<br/><br/>Pastikan backup disimpan di lokasi yang aman dan terpisah dari cluster untuk proteksi maksimal terhadap data loss.",
      codeSnippet:
        "ETCDCTL_API=3 etcdctl snapshot save /backups/etcd-$(date +%F-%H%M%S).db",
      language: "bash",
      analysis: {
        risk: "Low",
        riskColor: "green",
        impacts: [
          "Mencadangkan state etcd ke file snapshot",
          "Cluster tidak terganggu selama backup",
          "Backup dapat digunakan untuk recovery cluster",
          "Membutuhkan ruang penyimpanan tambahan pada node backup",
        ],
        duration: "~45 detik",
        space: "1.2 GB",
      },
    },
  },
  {
    id: 4,
    text: "Resource pressure",
    icon: "gauge",
    command: "Cek node yang resource pressure",
    response: {
      type: "ai",
      content:
        "<strong>Analisis Resource Pressure Node Cluster</strong><br/><br/>Scanning node menunjukkan tekanan resource yang signifikan. Berikut penjelasan detail tentang apa yang ditemukan dan rekomendasi tindakan:<br/><br/><strong>Indikator Resource Pressure:</strong><br/>• CPU Throttling - Pod CPU request tidak terpenuhi karena kepadatan tinggi<br/>• Memory Pressure - Node mendekati kapasitas memori maksimal<br/>• Disk Pressure - Storage node hampir penuh<br/>• PID Pressure - Jumlah process mencapai limit kernel<br/><br/><strong>Dampak Potensial:</strong><br/>• Pod baru mungkin pending karena tidak ada resource<br/>• Performance degradation untuk workload existing<br/>• Risk of node becoming NotReady jika tidak dimitigasi<br/><br/><strong>Rekomendasi Aksi:</strong><br/>1. Scale out cluster dengan menambah node baru<br/>2. Melakukan pod eviction dan rebalancing<br/>3. Meng-optimize resource requests/limits<br/>4. Menghapus pod yang tidak dibutuhkan",
      codeSnippet: "kubectl top nodes | sort -k3 -nr",
      language: "bash",
      analysis: {
        risk: "Low",
        riskColor: "green",
        impacts: [
          "Mengidentifikasi node yang kelebihan beban",
          "Menentukan apakah perlu scaling atau penyeimbangan ulang",
          "Memberikan informasi CPU dan memori terkini",
          "Membantu merencanakan tindakan mitigasi resource pressure",
        ],
        duration: "~10 detik",
        space: "0 MB",
      },
    },
  },
];
