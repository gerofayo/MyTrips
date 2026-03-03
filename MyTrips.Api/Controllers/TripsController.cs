using Microsoft.AspNetCore.Mvc;
using MyTrips.Api.DTOs;
using MyTrips.Api.DTOs.Trips;
using MyTrips.Api.Enums;
using MyTrips.Api.Services;
using MyTrips.Api.Repositories;

namespace MyTrips.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TripsController(TripService tripService, ITripRepository tripRepository) : ControllerBase
    {

        private readonly TripService _tripService = tripService;
        private readonly ITripRepository _tripRepository = tripRepository;

        [HttpPost]
        public ActionResult<TripResponse> CreateTrip(CreateTripRequest request)
        {
            var createdTrip = _tripService.CreateTrip(request);
            return CreatedAtAction(nameof(GetTripById), new { id = createdTrip.Id }, createdTrip);
        }

        [HttpGet]
        public ActionResult<IEnumerable<TripResponse>> GetAllTrips()
        {
            var response = _tripService.GetAllTrips();
            return Ok(response);
        }

        [HttpGet("{id:guid}")]
        public ActionResult<TripResponse> GetTripById(Guid id)
        {
            var trip = _tripService.GetTripById(id);

            if (trip is null)
                return NotFound();

            return Ok(trip);
        }

        [HttpPut("{id:guid}")]
        public ActionResult<TripResponse> UpdateTrip(Guid id, CreateTripRequest request)
        {
            var trip = _tripService.UpdateTrip(id, request);

            if (trip is null)
                return NotFound();

            return Ok(trip);
        }


        [HttpDelete("{id:guid}")]
        public ActionResult DeleteTrip(Guid id)
        {
            var isDeleted = _tripService.DeleteTrip(id);

            if (!isDeleted)
                return NotFound();
            else
                return NoContent();

        }

        [HttpPost("import")]
        public IActionResult ImportTrips([FromForm] IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            if (file.ContentType != "application/json")
                return BadRequest("Only JSON files are allowed");

            try
            {
                using var reader = new StreamReader(file.OpenReadStream());
                var json = reader.ReadToEnd();
                
                _tripRepository.Import(json);
                return Ok(new { message = "Trips imported successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest($"Import failed: {ex.Message}");
            }
        }

        [HttpGet("export")]
        public IActionResult ExportTrips()
        {
            try
            {
                var json = _tripRepository.Export();
                var bytes = System.Text.Encoding.UTF8.GetBytes(json);
                return File(bytes, "application/json", "mytrips_export.json");
            }
            catch (Exception ex)
            {
                return BadRequest($"Export failed: {ex.Message}");
            }
        }
    }
}
