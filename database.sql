-- ====================================================
-- QUERY SQL DATABASE STUDYFLOW
-- ====================================================
-- Database untuk menyimpan data users dan todo mereka.
-- Jalankan query ini di phpMyAdmin untuk membuat database
-- dan tabel yang diperlukan.
-- ====================================================

-- Membuat database baru bernama studyflow
CREATE DATABASE IF NOT EXISTS studyflow;
USE studyflow;

-- ====================================================
-- TABEL USERS
-- ====================================================
-- Tabel ini menyimpan informasi user yang register.
-- Setiap user memiliki id unik, email, password (dienkripsi), dan nama.
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nama_lengkap VARCHAR(255) NOT NULL,
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    diupdate_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ====================================================
-- TABEL TODOS
-- ====================================================
-- Tabel ini menyimpan setiap todo dari setiap user.
-- Setiap todo memiliki:
-- - id: ID unik todo
-- - user_id: ID user yang membuat todo (foreign key ke tabel users)
-- - nama_tugas: Nama tugas yang dibuat user
-- - mata_kuliah: Mata kuliah terkait (contoh: "Pemrograman Web")
-- - deadline: Tanggal deadline (format: YYYY-MM-DD)
-- - sudah_selesai: Status apakah sudah dikerjakan (0 = belum, 1 = sudah)
-- - dibuat_pada: Waktu todo dibuat (otomatis saat INSERT)
CREATE TABLE todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    nama_tugas VARCHAR(255) NOT NULL,
    mata_kuliah VARCHAR(255) NOT NULL,
    deadline DATE NOT NULL,
    sudah_selesai TINYINT DEFAULT 0,
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ====================================================
-- INDEX UNTUK PERFORMA
-- ====================================================
-- Menambahkan index supaya query lebih cepat
-- saat mencari todo berdasarkan user_id
CREATE INDEX idx_user_id ON todos(user_id);
CREATE INDEX idx_deadline ON todos(deadline);
