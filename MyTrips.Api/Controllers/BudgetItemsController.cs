using Microsoft.AspNetCore.Mvc;
using MyTrips.Api.DTOs.BudgetItems;
using MyTrips.Api.Enums;
using MyTrips.Api.Services;

namespace MyTrips.Api.Controllers
{
    [Route("api/trips/{tripId:guid}/budget-items")]
    [ApiController]
    public class BudgetItemsController : ControllerBase
    {
        private readonly BudgetItemService _budgetItemService;

        public BudgetItemsController(BudgetItemService budgetItemService)
        {
            _budgetItemService = budgetItemService;
        }

        private Guid? TryGetSessionId()
        {
            var sessionIdHeader = Request.Headers["X-Session-Id"].FirstOrDefault();
            
            // Return null if SessionId is missing or invalid
            // Do NOT generate a new GUID - this would create isolated sessions
            if (string.IsNullOrEmpty(sessionIdHeader) || !Guid.TryParse(sessionIdHeader, out var sessionId))
            {
                return null;
            }
            
            return sessionId;
        }

        private Guid GetSessionId()
        {
            var sessionId = TryGetSessionId();
            if (!sessionId.HasValue)
            {
                throw new InvalidOperationException("X-Session-Id header is required and must be a valid GUID");
            }
            return sessionId.Value;
        }

        private ActionResult ValidateSessionId()
        {
            if (!TryGetSessionId().HasValue)
            {
                return BadRequest("X-Session-Id header is required and must be a valid GUID");
            }
            return null!;
        }

        [HttpPost]
        public ActionResult<BudgetItemResponse> CreateBudgetItem(
            Guid tripId,
            CreateBudgetItemRequest request)
        {
            var validationError = ValidateSessionId();
            if (validationError != null) return validationError;
            
            var sessionId = GetSessionId();
            var createdItem = _budgetItemService.CreateBudgetItem(sessionId, tripId, request);

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
            var validationError = ValidateSessionId();
            if (validationError != null) return validationError;
            
            var sessionId = GetSessionId();
            var items = _budgetItemService.GetAllBudgetItems(sessionId, tripId);

            if (items is null)
                return NotFound();

            return Ok(items);
        }

        [HttpGet("{id:guid}")]
        public ActionResult<BudgetItemResponse> GetBudgetItemById(Guid tripId, Guid id)
        {
            var validationError = ValidateSessionId();
            if (validationError != null) return validationError;
            
            var sessionId = GetSessionId();
            var item = _budgetItemService.GetBudgetItemById(sessionId, tripId, id);

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
            var validationError = ValidateSessionId();
            if (validationError != null) return validationError;
            
            var sessionId = GetSessionId();
            var updatedItem = _budgetItemService.UpdateBudgetItem(sessionId, tripId, id, request);

            if (updatedItem is null)
                return NotFound();

            return Ok(updatedItem);
        }

        [HttpDelete("{id:guid}")]
        public IActionResult DeleteBudgetItem(Guid tripId, Guid id)
        {
            var validationError = ValidateSessionId();
            if (validationError != null) return validationError;
            
            var sessionId = GetSessionId();
            var deleted = _budgetItemService.DeleteBudgetItem(sessionId, tripId, id);

            if (!deleted)
                return NotFound();

            return NoContent();
        }

        [HttpGet("~/api/budget-items/categories")]
        public IActionResult GetCategories()
        {
            var categories = Enum.GetNames(typeof(ExpenseCategory));
            return Ok(categories);
        }

    }
}
