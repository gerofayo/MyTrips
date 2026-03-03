using Microsoft.AspNetCore.Mvc;
using MyTrips.Api.DTOs;
using MyTrips.Api.DTOs.Trips;
using MyTrips.Api.Services;
using MyTrips.Api.Repositories;

namespace MyTrips.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TripsController(TripService tripService, ISessionRepository sessionRepository) : ControllerBase
    {

        private readonly TripService _tripService = tripService;
        private readonly ISessionRepository _sessionRepository = sessionRepository;

        private Guid GetSessionId()
        {
            var sessionIdHeader = Request.Headers["X-Session-Id"].FirstOrDefault();
            if (string.IsNullOrEmpty(sessionIdHeader) || !Guid.TryParse(sessionIdHeader, out var sessionId))
            {
                sessionId = Guid.NewGuid();
            }
            return sessionId;
        }

        [HttpPost]
        public ActionResult<TripResponse> CreateTrip(CreateTripRequest request)
        {
            var sessionId = GetSessionId();
            var createdTrip = _tripService.CreateTrip(sessionId, request);
            return CreatedAtAction(nameof(GetTripById), new { id = createdTrip.Id }, createdTrip);
        }

        [HttpGet]
        public ActionResult<IEnumerable<TripResponse>> GetAllTrips()
        {
            var sessionId = GetSessionId();
            var response = _tripService.GetAllTrips(sessionId);
            return Ok(response);
        }

        [HttpGet("{id:guid}")]
        public ActionResult<TripResponse> GetTripById(Guid id)
        {
            var sessionId = GetSessionId();
            var trip = _tripService.GetTripById(sessionId, id);

            if (trip is null)
                return NotFound();

            return Ok(trip);
        }

        [HttpPut("{id:guid}")]
        public ActionResult<TripResponse> UpdateTrip(Guid id, CreateTripRequest request)
        {
            var sessionId = GetSessionId();
            var trip = _tripService.UpdateTrip(sessionId, id, request);

            if (trip is null)
                return NotFound();

            return Ok(trip);
        }


        [HttpDelete("{id:guid}")]
        public ActionResult DeleteTrip(Guid id)
        {
            var sessionId = GetSessionId();
            var isDeleted = _tripService.DeleteTrip(sessionId, id);

            if (!isDeleted)
                return NotFound();
            else
                return NoContent();

        }

        [HttpPost("import")]
        public IActionResult ImportTrips([FromForm] IFormFile file)
        {
            var sessionId = GetSessionId();
            
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            if (file.ContentType != "application/json")
                return BadRequest("Only JSON files are allowed");

            try
            {
                using var reader = new StreamReader(file.OpenReadStream());
                var json = reader.ReadToEnd();
                
                _sessionRepository.Import(sessionId, json);
                return Ok(new { message = "Trips imported successfully", sessionId });
            }
            catch (Exception ex)
            {
                return BadRequest($"Import failed: {ex.Message}");
            }
        }

        [HttpGet("export")]
        public IActionResult ExportTrips()
        {
            var sessionId = GetSessionId();
            
            try
            {
                var json = _sessionRepository.Export(sessionId);
                var bytes = System.Text.Encoding.UTF8.GetBytes(json);
                return File(bytes, "application/json", "mytrips_export.json");
            }
            catch (Exception ex)
            {
                return BadRequest($"Export failed: {ex.Message}");
            }
        }

        [HttpPost("session")]
        public IActionResult CreateSession()
        {
            var sessionId = Guid.NewGuid();
            return Ok(new { sessionId });
        }
    }
}
