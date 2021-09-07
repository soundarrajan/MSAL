using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Shiptech.Common.Dtos
{
    public class MastersRequestDto
    {
        public List<long> VesselIds { get; set; }

        public List<long> TerminalIds { get; set; }

        public List<long> LocationIds { get; set; }

        public List<long> ProductIds { get; set; }

        public List<long> CounterpartyIds { get; set; }
        public List<long> StatusIds { get; set; }
        public List<long> UomIds { get; set; }
        public List<long?> ServiceIds { get; set; }
        public List<long?> CompanyIds { get; set; }
    }

    public class MastersResponseDto
    {
        public List<IdNameDto> Vessels { get; set; }

        public List<IdNameDto> Terminals { get; set; }

        public List<IdNameDto> Locations { get; set; }

        public List<IdNameDto> Products { get; set; }

        public List<IdNameDto> Counterparties { get; set; }
        public List<IdNameDto> Statuss { get; set; }
        public List<IdNameDto> Uoms { get; set; }
        public List<IdNameDto> Services { get; set; }
        public List<IdNameDto> Companys { get; set; }
    }
}
