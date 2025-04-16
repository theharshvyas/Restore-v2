namespace API.DTOs;

public class BasketDto
{
    public required string BaseketId { get; set; }
    public List<BasketItemDto> Items { get; set; } = [];
}
