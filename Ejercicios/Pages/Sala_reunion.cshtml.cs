using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Ejercicios.Pages
{
    public class SalaReunionModel : PageModel
    {
        private readonly ILogger<SalaReunionModel> _logger;

        public SalaReunionModel(ILogger<SalaReunionModel> logger)
        {
            _logger = logger;
        }

        public void OnGet()
        {

        }
    }
}
