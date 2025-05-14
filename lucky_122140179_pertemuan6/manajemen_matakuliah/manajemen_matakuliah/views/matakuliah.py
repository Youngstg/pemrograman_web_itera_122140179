from pyramid.view import view_config
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest
from ..models import Matakuliah

@view_config(route_name='matakuliah_list', renderer='json')
def matakuliah_list(request):
    dbsession = request.dbsession
    matakuliahs = dbsession.query(Matakuliah).all()
    return {'matakuliahs': [m.to_dict() for m in matakuliahs]}

@view_config(route_name='matakuliah_detail', renderer='json')
def matakuliah_detail(request):
    dbsession = request.dbsession
    matakuliah_id = request.matchdict.get('id')
    mk = dbsession.query(Matakuliah).filter_by(id=matakuliah_id).first()
    if not mk:
        return HTTPNotFound(json_body={'error': 'Matakuliah tidak ditemukan'})
    return {'matakuliah': mk.to_dict()}

@view_config(route_name='matakuliah_add', request_method='POST', renderer='json')
def matakuliah_add(request):
    try:
        data = request.json_body
        required = ['kode_mk', 'nama_mk', 'sks', 'semester']
        for field in required:
            if field not in data:
                return HTTPBadRequest(json_body={'error': f'{field} wajib diisi'})
        
        mk = Matakuliah(
            kode_mk=data['kode_mk'],
            nama_mk=data['nama_mk'],
            sks=int(data['sks']),
            semester=int(data['semester']),
        )
        request.dbsession.add(mk)
        request.dbsession.flush()
        return {'success': True, 'matakuliah': mk.to_dict()}
    except Exception as e:
        return HTTPBadRequest(json_body={'error': str(e)})

@view_config(route_name='matakuliah_update', request_method='PUT', renderer='json')
def matakuliah_update(request):
    matakuliah_id = request.matchdict.get('id')
    dbsession = request.dbsession
    mk = dbsession.query(Matakuliah).filter_by(id=matakuliah_id).first()
    if not mk:
        return HTTPNotFound(json_body={'error': 'Matakuliah tidak ditemukan'})
    
    data = request.json_body
    if 'kode_mk' in data:
        mk.kode_mk = data['kode_mk']
    if 'nama_mk' in data:
        mk.nama_mk = data['nama_mk']
    if 'sks' in data:
        mk.sks = int(data['sks'])
    if 'semester' in data:
        mk.semester = int(data['semester'])

    return {'success': True, 'matakuliah': mk.to_dict()}

@view_config(route_name='matakuliah_delete', request_method='DELETE', renderer='json')
def matakuliah_delete(request):
    matakuliah_id = request.matchdict.get('id')
    dbsession = request.dbsession
    mk = dbsession.query(Matakuliah).filter_by(id=matakuliah_id).first()
    if not mk:
        return HTTPNotFound(json_body={'error': 'Matakuliah tidak ditemukan'})
    
    dbsession.delete(mk)
    return {'success': True, 'message': f'Matakuliah id {matakuliah_id} berhasil dihapus'}
