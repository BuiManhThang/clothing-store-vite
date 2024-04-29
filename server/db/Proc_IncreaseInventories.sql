use clothing_store;

drop procedure if exists Proc_IncreaseInventories;

create procedure if not exists Proc_IncreaseInventories (in inventoryItems json, in userId char(36)) begin
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
  i.quantity = i.quantity + ti.quantity,
  updatedAt = now (),
  updatedBy = userId;

insert into
  inventory (
    id,
    productId,
    colorId,
    sizeId,
    quantity,
    createdAt,
    createdBy
  )
select
  uuid (),
  ti.productId,
  ti.colorId,
  ti.sizeId,
  ti.quantity,
  now (),
  userId
from
  tmp_inventory ti
  left join inventory i on ti.productId = i.productId
  and ti.colorId = i.colorId
  and ti.sizeId = i.sizeId
where
  i.id is null;

drop temporary table if exists tmp_inventory;

end;