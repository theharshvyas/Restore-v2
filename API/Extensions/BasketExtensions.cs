using API.DTOs;
using API.Entities;

namespace API.Extensions;

public static class BasketExtensions
{
    public static BasketDto ToDto(this Basket basket) // basket.ToDto()
    {
        return new BasketDto
            {
                BaseketId = basket.BaseketId,
                Items = [.. basket.Items.Select(x => new BasketItemDto
                {
                    ProductId = x.ProductId,
                    Name = x.Product.Name,
                    Price = x.Product.Price,
                    Brand = x.Product.Brand,
                    Type = x.Product.Type,
                    PictureUrl = x.Product.PictureUrl,
                    Quantity = x.Quantity
                })]
            };
    }
}
