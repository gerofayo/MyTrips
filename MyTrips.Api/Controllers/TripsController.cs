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
        public ActionResult<TripResponse> UpdateTrip(Guid id, UpdateTripRequest request)
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

            var tempPath = Path.GetTempFileName();
            
            try
            {
                using (var stream = new FileStream(tempPath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }

                if (_tripRepository is JsonFileRepository jsonRepo)
                {
                    jsonRepo.ImportFromFile(tempPath);
                    return Ok(new { message = "Trips imported successfully" });
                }
                else
                {
                    return BadRequest("Import functionality is only available with JSON file repository");
                }
            }
            catch (Exception ex)
            {
                return BadRequest($"Import failed: {ex.Message}");
            }
            finally
            {
                if (System.IO.File.Exists(tempPath))
                    System.IO.File.Delete(tempPath);
            }
        }

        [HttpGet("export")]
        public IActionResult ExportTrips()
        {
            if (_tripRepository is JsonFileRepository jsonRepo)
            {
                var exportPath = Path.GetTempFileName();
                jsonRepo.ExportToFile(exportPath);

                var fileBytes = System.IO.File.ReadAllBytes(exportPath);
                System.IO.File.Delete(exportPath);

                return File(fileBytes, "application/json", "mytrips_export.json");
            }
            else
            {
                return BadRequest("Export functionality is only available with JSON file repository");
            }
        }
    }
}
