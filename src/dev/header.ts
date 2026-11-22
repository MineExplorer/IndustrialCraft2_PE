/*
  ___               _                 _            _           _      ____                    __   _   
 ║_ _║  _ __     __║ ║  _   _   ___  ║ ║_   _ __  ║_║   __ _  ║ ║    / ___║  _ __    __ _   _/ _║ ║ ║_ 
  ║ ║  ║ '_ \   / _` ║ ║ ║ ║ ║ / __║ ║ __║ ║ '__║ ,─╗  / _` ║ ║ ║   ║ ║     ║ '__║  / _` ║ [  _]  ║ __║
  ║ ║  ║ ║ ║ ║ ║ (_║ ║ ║ ║_║ ║ \__ \ ║ ║_  ║ ║    ║ ║ ║ (_║ ║ ║ ║   ║ ║___  ║ ║    ║ (_║ ║  ║ ║   ║ ║_ 
 ║___║ ║_║ ║_║  \__,_║  \__,_║ |___/  \__║ ║_║    ║_║  \__,_║ ║_║    \____║ ║_║     \__,_║  ║_║    \__║
 
 by MineExplorer (vk.com/vlad.gr2027) and NikolaySavenko (vk.com/savenkons)
 based on Industrial Core by zheka_smirnov (vk.com/zheka_smirnov)

 This code is a copyright, do not distribute.
*/

// libraries
IMPORT("BlockEngine");
IMPORT("flags");
IMPORT("EnergyNet");
IMPORT("ChargeItem");
IMPORT("TileRender");
IMPORT("StorageInterface");
IMPORT("SoundLib");
IMPORT("BackpackAPI");

const startTime = Debug.sysTime();
ItemModel.setCurrentCacheGroup("industrial-craft", "2");

// constants
const GUI_SCALE = 3.2;
const GUI_SCALE_NEW = 3;
const fallVelocity = -0.0784;
const ELECTRIC_ITEM_MAX_DAMAGE = 27;

// import values
const Color = android.graphics.Color;
const PotionEffect = Native.PotionEffect;
const ParticleType = Native.ParticleType;
const BlockSide = Native.BlockSide;
const EntityType = Native.EntityType;

// reverse compatibility for Inner Core 2.4.0b122
if (typeof EDamageCause === "undefined") {
    (globalThis as any).EDamageCause = {
		GENERIC: 0,
		CACTUS: 1,
		MOB: 2,
		IMPACT: 3,
		IN_WALL: 4,
		FALL: 5,
		IN_FIRE: 6,
		ON_FIRE: 7,
		LAVA: 8,
		DROWN: 9,
		EXPLOSION: 10,
		MOB_EXPLOSION: 11,
		OUT_OF_WORLD: 12,
		COMMAND: 13,
		MAGIC: 14,
		WITHER: 15,
		STARVE: 16,
		ANVIL: 17,
		THORNS: 18,
		PROJECTILE: 19,
		FALLING_BLOCK: 20,
		FLY_INTO_WALL: 21,
		MAGMA: 22,
		FIREWORKS: 23,
		LIGHTNING_BOLT: 24
	};
}

// energy (Eu)
const EU = EnergyTypeRegistry.assureEnergyType("Eu", 1);

// vanilla items
Recipes.addFurnaceFuel(325, 10, 2000); // lava bucket
ChargeItemRegistry.registerFlashItem(331, "Eu", 800, 0); // redstone

type KeyValueMap<V> = {
	[key: string | number]: V
}