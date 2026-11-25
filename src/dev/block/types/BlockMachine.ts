/// <reference path="./BlockStone.ts" />

class BlockMachine extends BlockStone {
	constructor(id: string, name: string, texture: [string, number] | [string, number][], hardness: number) {
		super(id, name, texture, MiningLevel.STONE);
		this.setDestroyTime(hardness);
		this.setExplosionResistance(10);
	}
}

// legacy
BlockRegistry.createBlockType("machine", {
	extends: "stone",
	destroyTime: 3
});