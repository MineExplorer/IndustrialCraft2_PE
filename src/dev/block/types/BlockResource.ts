class BlockResource extends BlockBase {
	constructor(id: string, resourceName: string, textures: string[], miningLevel: number, hardness: number = 4) {
		super(id, "stone");
		const name = resourceName + "_block";
		const textureList: [string, number][] = textures.map(texture => [texture, 0]);
		this.addVariation(name, textureList, true);
		this.setBlockMaterial("stone", miningLevel);
		this.setDestroyTime(hardness);
		this.setExplosionResistance(10);
	}
}
