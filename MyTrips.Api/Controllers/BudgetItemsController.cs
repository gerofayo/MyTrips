using Microsoft.AspNetCore.Mvc;
using MyTrips.Api.DTOs.BudgetItems;
using MyTrips.Api.Services;

namespace MyTrips.Api.Controllers
{
    [Route("api/trips/{tripId:guid}/[controller]")]
    [ApiController]
    public class BudgetItemsController : ControllerBase
    {
        private readonly BudgetItemService _budgetItemService;

        public BudgetItemsController(BudgetItemService budgetItemService)
        {
            _budgetItemService = budgetItemService;
        }

        [HttpPost]
        public ActionResult<BudgetItemResponse> CreateBudgetItem(
            Guid tripId,
            CreateBudgetItemRequest request)
        {
            var createdItem = _budgetItemService.CreateBudgetItem(tripId, request);

            if (createdItem is null)
                return NotFound();

            return CreatedAtAction(
                nameof(GetBudgetItemById),
                new { tripId, id = createdItem.Id },
                createdItem
            );
        }

        [HttpGet]
        public ActionResult<IEnumerable<BudgetItemResponse>> GetAllBudgetItems(Guid tripId)
        {
            var items = _budgetItemService.GetAllBudgetItems(tripId);

            if (items is null)
                return NotFound();

            return Ok(items);
        }

        [HttpGet("{id:guid}")]
        public ActionResult<BudgetItemResponse> GetBudgetItemById(Guid tripId, Guid id)
        {
            var item = _budgetItemService.GetBudgetItemById(tripId, id);

            if (item is null)
                return NotFound();

            return Ok(item);
        }

        [HttpPut("{id:guid}")]
        public ActionResult<BudgetItemResponse> UpdateBudgetItem(
            Guid tripId,
            Guid id,
            UpdateBudgetItemRequest request)
        {
            var updatedItem = _budgetItemService.UpdateBudgetItem(tripId, id, request);

            if (updatedItem is null)
                return NotFound();

            return Ok(updatedItem);
        }

        [HttpDelete("{id:guid}")]
        public IActionResult DeleteBudgetItem(Guid tripId, Guid id)
        {
            var deleted = _budgetItemService.DeleteBudgetItem(tripId, id);

            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}
