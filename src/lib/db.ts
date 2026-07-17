import mysql from "mysql2/promise"

const pool = mysql.createPool({
  host: process.env.DB_HOST || "gateway01.us-east-1.prod.aws.tidbcloud.com",
  port: Number(process.env.DB_PORT) || 4000,
  user: process.env.DB_USER || "3C6MgdUnmujCqv7.root",
  password: process.env.DB_PASSWORD || "lWMkUz0wQqh4QvET",
  database: process.env.DB_NAME || "bot_dashboard",
  ssl: { rejectUnauthorized: false },
  waitForConnections: true,
  connectionLimit: 5,
  enableKeepAlive: true,
})

export async function query(sql: string, params?: any[]) {
  const [rows] = await pool.execute(sql, params)
  return rows as any
}

export async function getRow(sql: string, params?: unknown[]) {
  const rows = (await query(sql, params)) as unknown[]
  return rows[0] || null
}

// --- Guild ---
export async function getGuildConfig(guildId: string) {
  return getRow("SELECT * FROM guilds WHERE id = ?", [guildId])
}

export async function upsertGuild(guildId: string, data: Record<string, unknown>) {
  const sets = Object.keys(data).map((k) => `${k} = ?`).join(", ")
  const values = Object.values(data)
  await query(
    `INSERT INTO guilds (id, ${Object.keys(data).join(", ")}) VALUES (?, ${Object.keys(data).map(() => "?").join(", ")}) ON DUPLICATE KEY UPDATE ${sets}`,
    [guildId, ...values, ...values]
  )
}

// --- Logs Config ---
export async function getLogsConfig(guildId: string) {
  return getRow("SELECT * FROM logs_config WHERE guild_id = ?", [guildId])
}

export async function upsertLogsConfig(guildId: string, data: Record<string, unknown>) {
  const keys = Object.keys(data)
  const sets = keys.map((k) => `${k} = ?`).join(", ")
  const values = Object.values(data)
  await query(
    `INSERT INTO logs_config (guild_id, ${keys.join(", ")}) VALUES (?, ${keys.map(() => "?").join(", ")}) ON DUPLICATE KEY UPDATE ${sets}`,
    [guildId, ...values, ...values]
  )
}

// --- TTS Config ---
export async function getTTSConfig(guildId: string) {
  return getRow("SELECT * FROM tts_config WHERE guild_id = ?", [guildId])
}

export async function upsertTTSConfig(guildId: string, data: Record<string, unknown>) {
  const keys = Object.keys(data)
  const sets = keys.map((k) => `${k} = ?`).join(", ")
  const values = Object.values(data)
  await query(
    `INSERT INTO tts_config (guild_id, ${keys.join(", ")}) VALUES (?, ${keys.map(() => "?").join(", ")}) ON DUPLICATE KEY UPDATE ${sets}`,
    [guildId, ...values, ...values]
  )
}

// --- Moderation Config ---
export async function getModerationConfig(guildId: string) {
  return getRow("SELECT * FROM moderation_config WHERE guild_id = ?", [guildId])
}

export async function upsertModerationConfig(guildId: string, data: Record<string, unknown>) {
  const keys = Object.keys(data)
  const sets = keys.map((k) => `${k} = ?`).join(", ")
  const values = Object.values(data)
  await query(
    `INSERT INTO moderation_config (guild_id, ${keys.join(", ")}) VALUES (?, ${keys.map(() => "?").join(", ")}) ON DUPLICATE KEY UPDATE ${sets}`,
    [guildId, ...values, ...values]
  )
}

// --- Warnings ---
export async function getWarnings(guildId: string, userId?: string) {
  if (userId) {
    return query("SELECT * FROM warnings WHERE guild_id = ? AND user_id = ? ORDER BY created_at DESC", [guildId, userId])
  }
  return query("SELECT * FROM warnings WHERE guild_id = ? ORDER BY created_at DESC LIMIT 50", [guildId])
}

export async function addWarning(data: Record<string, unknown>) {
  const keys = Object.keys(data)
  await query(
    `INSERT INTO warnings (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`,
    Object.values(data)
  )
}

// --- Music Config ---
export async function getMusicConfig(guildId: string) {
  return getRow("SELECT * FROM music_config WHERE guild_id = ?", [guildId])
}

export async function upsertMusicConfig(guildId: string, data: Record<string, unknown>) {
  const keys = Object.keys(data)
  const sets = keys.map((k) => `${k} = ?`).join(", ")
  const values = Object.values(data)
  await query(
    `INSERT INTO music_config (guild_id, ${keys.join(", ")}) VALUES (?, ${keys.map(() => "?").join(", ")}) ON DUPLICATE KEY UPDATE ${sets}`,
    [guildId, ...values, ...values]
  )
}

// --- Auto Mod Config ---
export async function getAutoModConfig(guildId: string) {
  return getRow("SELECT * FROM auto_mod_config WHERE guild_id = ?", [guildId])
}

export async function upsertAutoModConfig(guildId: string, data: Record<string, unknown>) {
  const keys = Object.keys(data)
  const sets = keys.map((k) => `${k} = ?`).join(", ")
  const values = Object.values(data)
  await query(
    `INSERT INTO auto_mod_config (guild_id, ${keys.join(", ")}) VALUES (?, ${keys.map(() => "?").join(", ")}) ON DUPLICATE KEY UPDATE ${sets}`,
    [guildId, ...values, ...values]
  )
}

// --- Welcome Config ---
export async function getWelcomeConfig(guildId: string) {
  return getRow("SELECT * FROM welcome_config WHERE guild_id = ?", [guildId])
}

export async function upsertWelcomeConfig(guildId: string, data: Record<string, unknown>) {
  const keys = Object.keys(data)
  const sets = keys.map((k) => `${k} = ?`).join(", ")
  const values = Object.values(data)
  await query(
    `INSERT INTO welcome_config (guild_id, ${keys.join(", ")}) VALUES (?, ${keys.map(() => "?").join(", ")}) ON DUPLICATE KEY UPDATE ${sets}`,
    [guildId, ...values, ...values]
  )
}

// --- Reaction Roles ---
export async function getReactionRoles(guildId: string) {
  return query("SELECT * FROM reaction_roles WHERE guild_id = ?", [guildId])
}

export async function addReactionRole(data: Record<string, unknown>) {
  const keys = Object.keys(data)
  await query(
    `INSERT INTO reaction_roles (${keys.join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`,
    Object.values(data)
  )
}

export async function deleteReactionRole(id: number) {
  await query("DELETE FROM reaction_roles WHERE id = ?", [id])
}

// --- Levels Config ---
export async function getLevelsConfig(guildId: string) {
  return getRow("SELECT * FROM levels_config WHERE guild_id = ?", [guildId])
}

export async function upsertLevelsConfig(guildId: string, data: Record<string, unknown>) {
  const keys = Object.keys(data)
  const sets = keys.map((k) => `${k} = ?`).join(", ")
  const values = Object.values(data)
  await query(
    `INSERT INTO levels_config (guild_id, ${keys.join(", ")}) VALUES (?, ${keys.map(() => "?").join(", ")}) ON DUPLICATE KEY UPDATE ${sets}`,
    [guildId, ...values, ...values]
  )
}

// --- User XP ---
export async function getLeaderboard(guildId: string, limit = 10) {
  return query(
    "SELECT * FROM user_xp WHERE guild_id = ? ORDER BY level DESC, xp DESC LIMIT ?",
    [guildId, limit]
  )
}

// --- Ticket Config ---
export async function getTicketConfig(guildId: string) {
  return getRow("SELECT * FROM ticket_config WHERE guild_id = ?", [guildId])
}

export async function upsertTicketConfig(guildId: string, data: Record<string, unknown>) {
  const keys = Object.keys(data)
  const sets = keys.map((k) => `${k} = ?`).join(", ")
  const values = Object.values(data)
  await query(
    `INSERT INTO ticket_config (guild_id, ${keys.join(", ")}) VALUES (?, ${keys.map(() => "?").join(", ")}) ON DUPLICATE KEY UPDATE ${sets}`,
    [guildId, ...values, ...values]
  )
}

// --- Economy Shop ---
export async function getEconomyShop(guildId: string) {
  return query("SELECT * FROM economy_shop WHERE guild_id = ?", [guildId])
}

// --- Giveaways ---
export async function getGiveaways(guildId: string) {
  return query("SELECT * FROM giveaways WHERE guild_id = ? ORDER BY end_time DESC", [guildId])
}

// --- Reminders ---
export async function getReminders(userId?: string) {
  if (userId) {
    return query("SELECT * FROM reminders WHERE user_id = ? ORDER BY remind_at", [userId])
  }
  return query("SELECT * FROM reminders WHERE remind_at <= NOW() AND reminded = 0")
}

// ============ CREATE TABLES ============
export async function createTables() {
  // Drop any leftover foreign key constraints from old schema
  try {
    const [fk] = await pool.execute(
      "SELECT CONSTRAINT_NAME FROM information_schema.TABLE_CONSTRAINTS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'economy_inventory' AND CONSTRAINT_TYPE = 'FOREIGN KEY'",
      [process.env.DB_NAME || "bot_dashboard"]
    )
    for (const row of fk as any[]) {
      await pool.execute(`ALTER TABLE economy_inventory DROP FOREIGN KEY \`${row.CONSTRAINT_NAME}\``)
    }
  } catch (_) {
    // table may not exist yet
  }
  const statements = [
    `CREATE TABLE IF NOT EXISTS guilds (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255),
      icon VARCHAR(512),
      owner_id VARCHAR(64),
      prefix VARCHAR(10) DEFAULT '!',
      language VARCHAR(10) DEFAULT 'es'
    )`,
    `CREATE TABLE IF NOT EXISTS logs_config (
      guild_id VARCHAR(64) PRIMARY KEY,
      channel_id VARCHAR(64),
      enabled BOOLEAN DEFAULT FALSE,
      log_joins BOOLEAN DEFAULT TRUE,
      log_leaves BOOLEAN DEFAULT TRUE,
      log_deletes BOOLEAN DEFAULT TRUE,
      log_edits BOOLEAN DEFAULT TRUE,
      log_avatar_changes BOOLEAN DEFAULT TRUE,
      log_name_changes BOOLEAN DEFAULT TRUE
    )`,
    `CREATE TABLE IF NOT EXISTS tts_config (
      guild_id VARCHAR(64) PRIMARY KEY,
      listen_text_channel_id VARCHAR(64),
      voice_language VARCHAR(20) DEFAULT 'es-ES',
      enabled BOOLEAN DEFAULT FALSE
    )`,
    `CREATE TABLE IF NOT EXISTS moderation_config (
      guild_id VARCHAR(64) PRIMARY KEY,
      warn_channel_id VARCHAR(64),
      auto_mod_enabled BOOLEAN DEFAULT FALSE,
      log_mod_actions BOOLEAN DEFAULT TRUE,
      mod_log_channel_id VARCHAR(64),
      mute_role_id VARCHAR(64),
      warn_threshold_mute INT DEFAULT 0,
      warn_threshold_kick INT DEFAULT 0,
      warn_threshold_ban INT DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS warnings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      guild_id VARCHAR(64),
      user_id VARCHAR(64),
      username VARCHAR(255),
      moderator_id VARCHAR(64),
      moderator_name VARCHAR(255),
      reason TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS music_config (
      guild_id VARCHAR(64) PRIMARY KEY,
      default_volume INT DEFAULT 50,
      max_duration INT DEFAULT 0,
      enabled BOOLEAN DEFAULT TRUE
    )`,
    `CREATE TABLE IF NOT EXISTS auto_mod_config (
      guild_id VARCHAR(64) PRIMARY KEY,
      enabled BOOLEAN DEFAULT FALSE,
      banned_words TEXT,
      max_mentions INT DEFAULT 5,
      max_links INT DEFAULT 3,
      warn_action VARCHAR(20) DEFAULT 'delete',
      max_caps INT DEFAULT 0,
      max_duplicates INT DEFAULT 0,
      link_whitelist TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS welcome_config (
      guild_id VARCHAR(64) PRIMARY KEY,
      channel_id VARCHAR(64),
      message TEXT,
      enabled BOOLEAN DEFAULT FALSE
    )`,
    `CREATE TABLE IF NOT EXISTS reaction_roles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      guild_id VARCHAR(64),
      message_id VARCHAR(64),
      channel_id VARCHAR(64),
      emoji VARCHAR(128),
      role_id VARCHAR(64)
    )`,
    `CREATE TABLE IF NOT EXISTS levels_config (
      guild_id VARCHAR(64) PRIMARY KEY,
      enabled BOOLEAN DEFAULT FALSE,
      xp_per_message INT DEFAULT 15,
      cooldown_seconds INT DEFAULT 60,
      level_up_channel_id VARCHAR(64)
    )`,
    `CREATE TABLE IF NOT EXISTS user_xp (
      guild_id VARCHAR(64),
      user_id VARCHAR(64),
      xp INT DEFAULT 0,
      level INT DEFAULT 1,
      PRIMARY KEY (guild_id, user_id)
    )`,
    `CREATE TABLE IF NOT EXISTS interaction_counts (
      sender_id VARCHAR(64),
      receiver_id VARCHAR(64),
      category VARCHAR(64),
      count INT DEFAULT 0,
      PRIMARY KEY (sender_id, receiver_id, category)
    )`,
    `CREATE TABLE IF NOT EXISTS economy (
      guild_id VARCHAR(64),
      user_id VARCHAR(64),
      balance INT DEFAULT 0,
      bank INT DEFAULT 0,
      last_daily DATETIME,
      last_work DATETIME,
      last_rob DATETIME,
      PRIMARY KEY (guild_id, user_id)
    )`,
    `CREATE TABLE IF NOT EXISTS economy_shop (
      id INT AUTO_INCREMENT PRIMARY KEY,
      guild_id VARCHAR(64),
      name VARCHAR(255),
      price INT,
      description TEXT,
      role_id VARCHAR(64)
    )`,
    `CREATE TABLE IF NOT EXISTS economy_inventory (
      id INT AUTO_INCREMENT PRIMARY KEY,
      guild_id VARCHAR(64),
      user_id VARCHAR(64),
      item_id INT,
      quantity INT DEFAULT 1
    )`,
    `CREATE TABLE IF NOT EXISTS reminders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id VARCHAR(64),
      channel_id VARCHAR(64),
      message TEXT,
      remind_at DATETIME,
      reminded BOOLEAN DEFAULT FALSE
    )`,
    `CREATE TABLE IF NOT EXISTS ticket_config (
      guild_id VARCHAR(64) PRIMARY KEY,
      category_id VARCHAR(64),
      support_role_id VARCHAR(64)
    )`,
    `CREATE TABLE IF NOT EXISTS tickets (
      id INT AUTO_INCREMENT PRIMARY KEY,
      guild_id VARCHAR(64),
      channel_id VARCHAR(64),
      user_id VARCHAR(64),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      closed BOOLEAN DEFAULT FALSE
    )`,
    `CREATE TABLE IF NOT EXISTS giveaways (
      id INT AUTO_INCREMENT PRIMARY KEY,
      guild_id VARCHAR(64),
      channel_id VARCHAR(64),
      message_id VARCHAR(64),
      prize TEXT,
      end_time DATETIME,
      host_id VARCHAR(64),
      ended BOOLEAN DEFAULT FALSE
    )`,
  ]
  for (const sql of statements) {
    await query(sql)
  }
}
