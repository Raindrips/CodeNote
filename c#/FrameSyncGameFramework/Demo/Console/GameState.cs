using System;
using FrameSyncGameFramework.Common.Interfaces;
using FrameSyncGameFramework.Common.Math;
using FrameSyncGameFramework.Snapshot.Interfaces;

namespace FrameSyncGameFramework.Demo.Console
{
    /// <summary>
    /// 示例游戏状态
    /// </summary>
    public class GameState : IGameState, ISnapshotable
    {
        public uint Frame { get; set; }
        public Dictionary<byte, PlayerState> Players { get; set; } = new();
        public List<ProjectileState> Projectiles { get; set; } = new();
        public FixedVector2 MapSize { get; set; } = new FixedVector2(100f, 100f);
        public int RandomSeed { get; set; }

        public GameState()
        {
            Reset();
        }

        public IGameState DeepCopy()
        {
            var copy = new GameState
            {
                Frame = Frame,
                MapSize = MapSize,
                RandomSeed = RandomSeed
            };

            // 深拷贝玩家状态
            foreach (var kvp in Players)
            {
                copy.Players[kvp.Key] = kvp.Value.DeepCopy();
            }

            // 深拷贝投射物状态
            foreach (var projectile in Projectiles)
            {
                copy.Projectiles.Add(projectile.DeepCopy());
            }

            return copy;
        }

        public void Reset()
        {
            Frame = 0;
            Players.Clear();
            Projectiles.Clear();
            MapSize = new FixedVector2(100f, 100f);
            RandomSeed = 42;
        }

        public void Update()
        {
            Frame++;

            // 更新玩家状态
            foreach (var player in Players.Values)
            {
                player.Update();
            }

            // 更新投射物状态
            for (int i = Projectiles.Count - 1; i >= 0; i--)
            {
                var projectile = Projectiles[i];
                projectile.Update();

                // 移除超出边界的投射物
                if (projectile.Position.X < FixedPoint.Zero || projectile.Position.X > MapSize.X ||
                    projectile.Position.Y < FixedPoint.Zero || projectile.Position.Y > MapSize.Y)
                {
                    Projectiles.RemoveAt(i);
                }
            }

            // 简单的碰撞检测
            CheckCollisions();
        }

        private void CheckCollisions()
        {
            // 玩家与投射物的碰撞
            foreach (var player in Players.Values)
            {
                for (int i = Projectiles.Count - 1; i >= 0; i--)
                {
                    var projectile = Projectiles[i];
                    
                    // 跳过玩家自己发射的投射物
                    if (projectile.OwnerId == player.PlayerId)
                        continue;

                    var distance = FixedVector2.Distance(player.Position, projectile.Position);
                    if (distance < player.Radius + projectile.Radius)
                    {
                        // 碰撞发生
                        player.Health -= projectile.Damage;
                        Projectiles.RemoveAt(i);
                    }
                }
            }
        }

        public void AddPlayer(byte playerId, string playerName)
        {
            if (!Players.ContainsKey(playerId))
            {
                Players[playerId] = new PlayerState
                {
                    PlayerId = playerId,
                    Name = playerName,
                    Position = new FixedVector2(
                        FixedPoint.FromFloat(10f + playerId * 10f),
                        FixedPoint.FromFloat(10f)
                    ),
                    Velocity = FixedVector2.Zero,
                    Health = 100,
                    MaxHealth = 100,
                    Radius = FixedPoint.FromFloat(1f)
                };
            }
        }

        public void RemovePlayer(byte playerId)
        {
            Players.Remove(playerId);
        }

        // ISnapshotable 实现
        public void Serialize(System.IO.BinaryWriter writer)
        {
            writer.Write(Frame);
            writer.Write(RandomSeed);
            writer.Write(MapSize.X.ToFloat());
            writer.Write(MapSize.Y.ToFloat());

            // 序列化玩家
            writer.Write(Players.Count);
            foreach (var kvp in Players)
            {
                writer.Write(kvp.Key);
                kvp.Value.Serialize(writer);
            }

            // 序列化投射物
            writer.Write(Projectiles.Count);
            foreach (var projectile in Projectiles)
            {
                projectile.Serialize(writer);
            }
        }

        public void Deserialize(System.IO.BinaryReader reader)
        {
            Frame = reader.ReadUInt32();
            RandomSeed = reader.ReadInt32();
            var mapX = reader.ReadSingle();
            var mapY = reader.ReadSingle();
            MapSize = new FixedVector2(mapX, mapY);

            // 反序列化玩家
            Players.Clear();
            var playerCount = reader.ReadInt32();
            for (int i = 0; i < playerCount; i++)
            {
                var playerId = reader.ReadByte();
                var player = new PlayerState();
                player.Deserialize(reader);
                Players[playerId] = player;
            }

            // 反序列化投射物
            Projectiles.Clear();
            var projectileCount = reader.ReadInt32();
            for (int i = 0; i < projectileCount; i++)
            {
                var projectile = new ProjectileState();
                projectile.Deserialize(reader);
                Projectiles.Add(projectile);
            }
        }

        public int GetSnapshotVersion()
        {
            return 1;
        }
    }

    /// <summary>
    /// 玩家状态
    /// </summary>
    public class PlayerState : ISnapshotable
    {
        public byte PlayerId { get; set; }
        public string Name { get; set; } = string.Empty;
        public FixedVector2 Position { get; set; }
        public FixedVector2 Velocity { get; set; }
        public int Health { get; set; }
        public int MaxHealth { get; set; }
        public FixedPoint Radius { get; set; }

        public PlayerState DeepCopy()
        {
            return new PlayerState
            {
                PlayerId = PlayerId,
                Name = Name,
                Position = Position,
                Velocity = Velocity,
                Health = Health,
                MaxHealth = MaxHealth,
                Radius = Radius
            };
        }

        public void Update()
        {
            // 简单的物理更新
            Position = Position + Velocity;
            Velocity = Velocity * FixedPoint.FromFloat(0.95f); // 摩擦力
        }

        public void Serialize(System.IO.BinaryWriter writer)
        {
            writer.Write(PlayerId);
            writer.Write(Name);
            writer.Write(Position.X.ToFloat());
            writer.Write(Position.Y.ToFloat());
            writer.Write(Velocity.X.ToFloat());
            writer.Write(Velocity.Y.ToFloat());
            writer.Write(Health);
            writer.Write(MaxHealth);
            writer.Write(Radius.ToFloat());
        }

        public void Deserialize(System.IO.BinaryReader reader)
        {
            PlayerId = reader.ReadByte();
            Name = reader.ReadString();
            var posX = reader.ReadSingle();
            var posY = reader.ReadSingle();
            Position = new FixedVector2(posX, posY);
            var velX = reader.ReadSingle();
            var velY = reader.ReadSingle();
            Velocity = new FixedVector2(velX, velY);
            Health = reader.ReadInt32();
            MaxHealth = reader.ReadInt32();
            var radius = reader.ReadSingle();
            Radius = FixedPoint.FromFloat(radius);
        }

        public int GetSnapshotVersion()
        {
            return 1;
        }
    }

    /// <summary>
    /// 投射物状态
    /// </summary>
    public class ProjectileState : ISnapshotable
    {
        public uint Id { get; set; }
        public byte OwnerId { get; set; }
        public FixedVector2 Position { get; set; }
        public FixedVector2 Velocity { get; set; }
        public FixedPoint Radius { get; set; }
        public int Damage { get; set; }
        public int Lifetime { get; set; }
        public int MaxLifetime { get; set; }

        public ProjectileState DeepCopy()
        {
            return new ProjectileState
            {
                Id = Id,
                OwnerId = OwnerId,
                Position = Position,
                Velocity = Velocity,
                Radius = Radius,
                Damage = Damage,
                Lifetime = Lifetime,
                MaxLifetime = MaxLifetime
            };
        }

        public void Update()
        {
            Position = Position + Velocity;
            Lifetime++;
        }

        public bool IsExpired()
        {
            return Lifetime >= MaxLifetime;
        }

        public void Serialize(System.IO.BinaryWriter writer)
        {
            writer.Write(Id);
            writer.Write(OwnerId);
            writer.Write(Position.X.ToFloat());
            writer.Write(Position.Y.ToFloat());
            writer.Write(Velocity.X.ToFloat());
            writer.Write(Velocity.Y.ToFloat());
            writer.Write(Radius.ToFloat());
            writer.Write(Damage);
            writer.Write(Lifetime);
            writer.Write(MaxLifetime);
        }

        public void Deserialize(System.IO.BinaryReader reader)
        {
            Id = reader.ReadUInt32();
            OwnerId = reader.ReadByte();
            var posX = reader.ReadSingle();
            var posY = reader.ReadSingle();
            Position = new FixedVector2(posX, posY);
            var velX = reader.ReadSingle();
            var velY = reader.ReadSingle();
            Velocity = new FixedVector2(velX, velY);
            var radius = reader.ReadSingle();
            Radius = FixedPoint.FromFloat(radius);
            Damage = reader.ReadInt32();
            Lifetime = reader.ReadInt32();
            MaxLifetime = reader.ReadInt32();
        }

        public int GetSnapshotVersion()
        {
            return 1;
        }
    }
}