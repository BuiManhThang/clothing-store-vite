use clothing_store;

drop procedure if exists Proc_DecreaseInventories;

create procedure if not exists Proc_DecreaseInventories (in inventoryItems json, in userId char(36)) begin
drop temporary table if exists tmp_inventory;

create temporary table if not exists tmp_inventory (
  productId char(36),
  colorId char(36),
  sizeId char(36),
  quantity int
)
select
  *
from
  json_table (
    inventoryItems,
    '$[*]' columns (
      productId char(36) path '$.productId',
      colorId char(36) path '$.colorId',
      sizeId char(36) path '$.sizeId',
      quantity int path '$.quantity'
    )
  ) as jt;

update inventory i
inner join tmp_inventory ti on i.productId = ti.productId
and i.colorId = ti.colorId
and i.sizeId = ti.sizeId
set
  i.quantity = i.quantity - ti.quantity,
  updatedAt = now (),
  updatedBy = userId;

delete i
from
  inventory i
  inner join tmp_inventory ti on i.productId = ti.productId
  and i.colorId = ti.colorId
  and i.sizeId = ti.sizeId
where
  i.quantity <= 0;

drop temporary table if exists tmp_inventory;

end;