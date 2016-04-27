import json

from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt

from pyepbd import FACTORESDEPASOOFICIALES, weighted_energy, readenergydata, ep2dict

@csrf_exempt
def epindicators(request):
    fakeresult = {"EPAren": 1.0, "EPAnren": 1.0, "EPAtotal": 2.0, "EPArer": 0.5,
                  "EPren": 1.0, "EPnren": 0.75, "EPtotal": 1.75, "EPrer": 0.6}
    f = open('pachi.log', 'w')

    if request.method == 'POST':
        if request.is_ajax():
            data = json.loads(request.body.decode('utf-8'))
            krdel = float(data.get('krdel', 1.0))
            kexp = float(data.get('kexp', 1.0))
            components = data.get('components', [])

            f.write("krdel: %s\n"
                    "kexp: %s \n"
                    "components: %s\n %s %s %s\n" %
                    (krdel, kexp, components,
                     type(krdel), type(kexp), type(components)))

            data = readenergydata(components)

            f.write("Energy data: %s" % data)

            epresults = weighted_energy(data, krdel, FACTORESDEPASOOFICIALES, kexp)
            result = ep2dict(epresults)
            return JsonResponse(result)

    return HttpResponse('API service')
