const PAINTER_INDEX_TO_COLOR = {
	0: "black",
	1: "red",
	2: "green",
	3: "brown",
	4: "blue",
	5: "purple",
	6: "cyan",
	7: "light_gray",
	8: "gray",
	9: "pink",
	10: "lime",
	11: "yellow",
	12: "light_blue",
	13: "magenta",
	14: "orange",
	15: "white"
}

class ItemPainter extends ItemCommon {
	readonly color: number;

	constructor(colorIndex: number) {
		const itemIndex = colorIndex + 1;
		const color = PAINTER_INDEX_TO_COLOR[colorIndex];
		super("icPainter" + itemIndex, "painter." + color, {name: "ic_painter", meta: itemIndex});
		this.setMaxStack(1);
		this.setMaxDamage(16);
		this.setCategory(ItemCategory.EQUIPMENT);
		this.color = colorIndex;
	}

	onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void {
		if (CableRegistry.canBePainted(block.id) && block.data != this.color) {
			const region = BlockSource.getDefaultForActor(player);
			region.setBlock(coords.x, coords.y, coords.z, block.id, this.color);
			const grid = EnergyNet.getNodeOnCoords(region, coords.x, coords.y, coords.z);
			if (grid && grid instanceof EUCableGrid) {
				grid.removeCoords(coords.x, coords.y, coords.z);
				grid.checkAndRebuild();
			}
			EnergyGridBuilder.onWirePlaced(region, coords.x, coords.y, coords.z);
			this.useItem(coords, item, player);
		} else if (block.id == 35 && block.data != 15 - this.color){
			const region = BlockSource.getDefaultForActor(player);
			region.setBlock(coords.x, coords.y, coords.z, 35, 15 - this.color);
			this.useItem(coords, item, player);
		}
	}
	
	useItem(coords: Callback.ItemUseCoordinates, item: ItemInstance, player: number) {
		SoundLib.playSoundAtBlock(coords, Entity.getDimension(player), "Painter.ogg", 0.5);
		if (!Game.isItemSpendingAllowed(player)) return;

		if (++item.data >= Item.getMaxDamage(item.id)) {
			item.id = ItemID.icPainter;
		}
		Entity.setCarriedItem(player, item.id, 1, item.data);
	}
}
